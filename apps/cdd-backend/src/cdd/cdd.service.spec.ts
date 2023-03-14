import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { CddService } from './cdd.service';
import { getQueueToken } from '@nestjs/bull';
import { MockPolymesh, mockQueue } from '../test-utils/mocks';
import { createMock } from '@golevelup/ts-jest';
import Redis from 'ioredis';
import { JumioService } from '../jumio/jumio.service';
import { NetkiService } from '../netki/netki.service';
import { Logger } from '@nestjs/common';

describe('CddService', () => {
  const address = 'some-address';
  const mockPolymesh = new MockPolymesh();
  const mockRedis = createMock<Redis>();
  const mockJumioService = createMock<JumioService>();
  const mockNetkiService = createMock<NetkiService>();
  const mockLogger = createMock<Logger>();
  let service: CddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddService,
        { provide: Polymesh, useValue: mockPolymesh },
        { provide: getQueueToken(), useValue: mockQueue },
        { provide: Redis, useValue: mockRedis },
        { provide: JumioService, useValue: mockJumioService },
        { provide: NetkiService, useValue: mockNetkiService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<CddService>(CddService);
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
