import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';
import { MockPolymesh } from '../test-utils/mocks';
import { CddProcessor } from './cdd.processor';
import { JumioCddJob, NetkiCddJob } from './types';
import { JumioCallbackDto } from '../jumio/types';

import jumioVerifiedData from '../test-utils/jumio-http/webhook-approved-verified.json';
import jumioCannotReadData from '../test-utils/jumio-http/webhook-cannot-read.json';
import { NetkiAccessCode, netkiAllocatedPrefixer } from '../netki/types';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('cddProcessor', () => {
  let mockRedis: DeepMocked<Redis>;
  const address = jumioVerifiedData.customerId;

  let mockPolymesh: MockPolymesh;
  let processor: CddProcessor;
  let mockRun: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddProcessor,
        { provide: Polymesh, useValue: new MockPolymesh() },
        { provide: Redis, useValue: createMock<Redis>() },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
      ],
    }).compile();

    processor = module.get<CddProcessor>(CddProcessor);
    mockRedis = module.get<typeof mockRedis>(Redis);
    mockPolymesh = module.get<typeof mockPolymesh>(Polymesh);

    mockRedis.get.mockResolvedValue(address);
    mockRun = jest.fn().mockResolvedValue('test-tx-result');
    mockPolymesh.identities.registerIdentity.mockResolvedValue({
      run: mockRun,
    });
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('generateCdd', () => {
    describe('with jumio job', () => {
      let mockJumioJob: Job<JumioCddJob>;
      beforeEach(() => {
        mockJumioJob = {
          ...createMock<Job>(),
          data: {
            type: 'jumio',
            value: jumioVerifiedData as JumioCallbackDto,
          },
        };
      });

      it('should create CDD claim and clear previous link attempts', async () => {
        await processor.generateCdd(mockJumioJob);

        expect(mockPolymesh.identities.registerIdentity).toHaveBeenCalledWith({
          targetAccount: address,
          createCdd: true,
        });
        expect(mockRun).toHaveBeenCalled();
        expect(mockRedis.del).toHaveBeenCalledWith(address);
      });

      it('should log and throw errors', async () => {
        const testError = new Error('test error');
        mockRun.mockRejectedValue(testError);

        await expect(processor.generateCdd(mockJumioJob)).rejects.toThrow(
          testError
        );
      });

      it('should perform no operation if status is not "VERIFIED_APPROVED"', async () => {
        mockJumioJob.data.value = jumioCannotReadData as JumioCallbackDto;

        await processor.generateCdd(mockJumioJob);

        expect(mockRun).not.toHaveBeenCalled();
      });
    });

    describe('with netki job', () => {
      describe('completed job', () => {
        let mockNetkiCompletedJob: Job<NetkiCddJob>;

        beforeEach(() => {
          mockNetkiCompletedJob = {
            ...createMock<Job>(),
            data: {
              type: 'netki',
              value: {
                identity: {
                  state: 'completed',
                  transaction_identity: {
                    client_guid: 'abc',
                    identity_access_code: {
                      code: 'xyz',
                      child_codes: [] as NetkiAccessCode[],
                    },
                  },
                },
              },
            },
          };
        });

        it('should create CDD claim and clear previous link attempts', async () => {
          await processor.generateCdd(mockNetkiCompletedJob);

          expect(mockRun).toHaveBeenCalled();
          expect(mockRedis.del).toHaveBeenCalledWith(address);
        });

        it('should throw if the address for the netki job is not found', async () => {
          mockRedis.get.mockResolvedValue(null);

          await expect(
            processor.generateCdd(mockNetkiCompletedJob)
          ).rejects.toThrowError();
        });
      });

      describe('restarted job', () => {
        const childCode = 'test-child-code';
        let mockNetkiRestartJob: Job<NetkiCddJob>;

        beforeEach(() => {
          mockNetkiRestartJob = {
            ...createMock<Job>(),
            data: {
              type: 'netki',
              value: {
                identity: {
                  state: 'restarted',
                  transaction_identity: {
                    client_guid: 'abc',
                    identity_access_code: {
                      code: 'xyz',
                      child_codes: [{ code: childCode }] as NetkiAccessCode[],
                    },
                  },
                },
              },
            },
          };
        });

        it('should associate the address to the new netki code', async () => {
          const expectedAppKey = netkiAllocatedPrefixer(childCode);

          await processor.generateCdd(mockNetkiRestartJob);

          expect(mockRedis.set).toHaveBeenCalledWith(expectedAppKey, address);
        });

        it('should throw if no access code is present', async () => {
          mockNetkiRestartJob.data.value.identity.transaction_identity.identity_access_code.child_codes =
            [];

          await expect(processor.generateCdd).rejects.toThrowError();
        });
      });
    });
  });
});
