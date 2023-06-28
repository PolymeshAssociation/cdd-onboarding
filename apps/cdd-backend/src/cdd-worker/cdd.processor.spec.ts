import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import { MockPolymesh } from '../test-utils/mocks';
import { CddProcessor } from './cdd.processor';
import { JumioCddJob, MockCddJob, NetkiCddJob } from './types';
import { JumioCallbackDto } from '../jumio/types';

import jumioVerifiedData from '../test-utils/jumio-http/webhook-approved-verified.json';
import jumioCannotReadData from '../test-utils/jumio-http/webhook-cannot-read.json';
import { NetkiAccessCode } from '../netki/types';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppRedisService } from '../app-redis/app-redis.service';
import { AddressBookService } from '../polymesh/address-book.service';

describe('cddProcessor', () => {
  let mockRedis: DeepMocked<AppRedisService>;
  const address = jumioVerifiedData.customerId;

  let mockPolymesh: MockPolymesh;
  let mockAddressBook: DeepMocked<AddressBookService>;
  let processor: CddProcessor;
  let mockRun: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddProcessor,
        { provide: Polymesh, useValue: new MockPolymesh() },
        { provide: AppRedisService, useValue: createMock<AppRedisService>() },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
        {
          provide: AddressBookService,
          useValue: createMock<AddressBookService>(),
        },
      ],
    }).compile();

    processor = module.get<CddProcessor>(CddProcessor);
    mockRedis = module.get<typeof mockRedis>(AppRedisService);
    mockPolymesh = module.get<typeof mockPolymesh>(Polymesh);
    mockAddressBook = module.get<typeof mockAddressBook>(AddressBookService);

    mockRedis.getNetkiAddress.mockResolvedValue(address);
    mockRun = jest.fn().mockResolvedValue('test-tx-result');
    mockPolymesh.identities.registerIdentity.mockResolvedValue({
      run: mockRun,
    });
    mockAddressBook.findAddress.mockImplementation(
      (signer: 'jumio' | 'netki' | 'mock') => {
        if (signer === 'jumio') {
          return 'jumioSignerAddress';
        }
        if (signer === 'netki') {
          return 'netkiSignerAddress';
        }
        if (signer === 'mock') {
          return 'mockSignerAddress';
        }

        throw new Error('mock signer not found');
      }
    );
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

        expect(mockPolymesh.identities.registerIdentity).toHaveBeenCalledWith(
          {
            targetAccount: address,
            createCdd: true,
          },
          { signingAccount: 'jumioSignerAddress' }
        );
        expect(mockRun).toHaveBeenCalled();
        expect(mockRedis.clearApplications).toHaveBeenCalledWith(address);
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

          expect(mockPolymesh.identities.registerIdentity).toHaveBeenCalledWith(
            {
              targetAccount: address,
              createCdd: true,
            },
            { signingAccount: 'netkiSignerAddress' }
          );
          expect(mockRun).toHaveBeenCalled();
          expect(mockRedis.clearApplications).toHaveBeenCalledWith(address);
        });

        it('should throw if the address for the netki job is not found', async () => {
          mockRedis.getNetkiAddress.mockRejectedValue(new Error('some error'));

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
          await processor.generateCdd(mockNetkiRestartJob);

          expect(mockRedis.setNetkiCodeToAddress).toHaveBeenCalledWith(
            childCode,
            address
          );
        });

        it('should throw if no access code is present', async () => {
          mockNetkiRestartJob.data.value.identity.transaction_identity.identity_access_code.child_codes =
            [];

          await expect(processor.generateCdd).rejects.toThrowError();
        });
      });
    });

    describe('with mock job', () => {
      let mockCddJob: Job<MockCddJob>;

      beforeEach(() => {
        mockCddJob = {
          ...createMock<Job>(),
          data: {
            type: 'mock',
            value: {
              address,
              id: 'abc',
            },
          },
        };
      });

      it('should create CDD claim and clear previous link attempts', async () => {
        mockPolymesh.network.getNetworkProperties.mockResolvedValue({
          name: 'someNetwork',
        });

        await processor.generateCdd(mockCddJob);

        expect(mockRun).toHaveBeenCalled();
        expect(mockRedis.clearApplications).toHaveBeenCalledWith(address);
      });

      it('should never create a CDD claim for mainnet address', () => {
        mockCddJob.data.value.address = '2SomeMainnetAddr';
        mockPolymesh.network.getNetworkProperties.mockResolvedValue({
          name: 'someNetwork',
        });

        const expectedError = new Error(
          'Cannot create mock CDD claim for address starting with "2"'
        );

        expect(processor.generateCdd(mockCddJob)).rejects.toThrow(
          expectedError
        );
      });

      it('should never create a CDD claim for mainnet network', () => {
        mockPolymesh.network.getNetworkProperties.mockResolvedValue({
          name: 'mainnet',
        });

        const expectedError = new Error(
          'Cannot process mock CDD jobs on mainnet'
        );

        expect(processor.generateCdd(mockCddJob)).rejects.toThrow(
          expectedError
        );
      });
    });
  });
});
