import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { CddService } from './cdd.service';
import { getQueueToken } from '@nestjs/bull';
import { MockPolymesh, mockQueue } from '../test-utils/mocks';
import { createMock } from '@golevelup/ts-jest';
import Redis from 'ioredis';
import { JumioService } from '../jumio/jumio.service';

describe('CddService', () => {
  const address = 'some-address';
  const mockPolymesh = new MockPolymesh();
  const mockRedis = createMock<Redis>();
  const mockJumioService = createMock<JumioService>();
  let service: CddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddService,
        { provide: Polymesh, useValue: mockPolymesh },
        { provide: getQueueToken('cdd'), useValue: mockQueue },
        { provide: Redis, useValue: mockRedis },
        { provide: JumioService, useValue: mockJumioService },
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

      expect(result).toEqual({ valid: true, previousLinks: [] });
    });

    it('should return `false` if the address does have an associated Identity', async () => {
      mockPolymesh.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue('someIdentity'),
      });

      const result = await service.verifyAddress(address);

      expect(result).toEqual({ valid: false, previousLinks: [] });
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
        });

        const link = await service.generateProviderLink({
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
