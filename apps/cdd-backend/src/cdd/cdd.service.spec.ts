import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { CddService } from './cdd.service';
import { getQueueToken } from '@nestjs/bull';
import { MockPolymesh, mockQueue } from '../test-utils/mocks';

const address = 'some-address';

const mockSdk = new MockPolymesh();

describe('CddService', () => {
  let service: CddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddService,
        { provide: Polymesh, useValue: mockSdk },
        { provide: getQueueToken('cdd'), useValue: mockQueue },
      ],
    }).compile();

    service = module.get<CddService>(CddService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyAddress', () => {
    it('should return `true` if the address does not have an associated Identity', async () => {
      mockSdk.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue(null),
      });

      const valid = await service.verifyAddress(address);

      expect(valid).toBe(true);
    });

    it('should return `false` if the address does have an associated Identity', async () => {
      mockSdk.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue('someIdentity'),
      });

      const valid = await service.verifyAddress(address);

      expect(valid).toBe(false);
    });
  });

  describe('generateCddLink', () => {
    it('should generate a link', async () => {
      const link = await service.generateProviderLink({
        address,
        provider: 'jumio',
      });

      expect(() => new URL(link)).not.toThrow();
    });
  });

  describe('queueCddRequest', () => {
    it('should call queue.add', async () => {
      await service.queueCddRequest({ address });

      expect(mockQueue.add).toHaveBeenCalled();
    });
  });
});
