import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { CddService } from './cdd.service';
import { getQueueToken } from '@nestjs/bull';
import { MockPolymesh } from '../test-utils/mocks';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import Redis from 'ioredis';
import { JumioService } from '../jumio/jumio.service';
import { NetkiService } from '../netki/netki.service';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

describe('CddService', () => {
  const address = 'some-address';
  let mockPolymesh: MockPolymesh;
  let mockRedis: DeepMocked<Redis>;
  let mockJumioService: DeepMocked<JumioService>;
  let service: CddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddService,
        { provide: Polymesh, useValue: new MockPolymesh() },
        { provide: getQueueToken(), useValue: createMock<Queue>() },
        { provide: Redis, useValue: createMock<Redis>() },
        { provide: JumioService, useValue: createMock<JumioService>() },
        { provide: NetkiService, useValue: createMock<NetkiService>() },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
      ],
    }).compile();

    service = module.get<CddService>(CddService);
    mockRedis = module.get<typeof mockRedis>(Redis);
    mockJumioService = module.get<typeof mockJumioService>(JumioService);
    mockPolymesh = module.get<typeof mockPolymesh>(Polymesh);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyAddress', () => {
    it('should return `true` if the address does not have an associated Identity', async () => {
      mockPolymesh.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue(null),
      });

      const result = await service.verifyAddress(address);

      expect(result).toEqual({ valid: true });
    });

    it('should return `false` if the address does have an associated Identity', async () => {
      mockPolymesh.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue('someIdentity'),
      });

      const result = await service.verifyAddress(address);

      expect(result).toEqual({ valid: false });
    });
  });

  describe('generateCddLink', () => {
    describe('when jumio is selected', () => {
      it('should generate a link and save a record of it', async () => {
        mockPolymesh.accountManagement.getAccount.mockResolvedValue({
          getIdentity: jest.fn().mockResolvedValue(null),
        });

        const expectedLink = 'https://example.com/';

        mockJumioService.generateLink.mockResolvedValue({
          redirectUrl: expectedLink,
          transactionReference: 'test-ref',
          timestamp: 'test-time',
        });

        const link = await service.getProviderLink({
          address,
          provider: 'jumio',
        });

        expect(link).toEqual(expectedLink);

        expect(mockRedis.sadd).toHaveBeenCalledWith(
          address,
          expect.stringContaining(expectedLink)
        );
      });
    });
  });
});
