import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';
import { MockPolymesh } from '../test-utils/mocks';
import { CddProcessor } from './cdd.processor';

describe('cddProcessor', () => {
  const mockRedis = createMock<Redis>();
  const mockLogger = createMock<Logger>();
  const address = 'test-address';

  let mockPolymesh: MockPolymesh;
  let processor: CddProcessor;
  let mockRun: jest.Mock;
  let mockJob: Job;

  beforeEach(async () => {
    mockJob = { ...createMock<Job>(), data: { address, id: '1' } };
    mockPolymesh = await MockPolymesh.create();
    mockRun = jest.fn().mockResolvedValue('test-tx-result');
    mockPolymesh.identities.registerIdentity.mockResolvedValue({
      run: mockRun,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddProcessor,
        { provide: Polymesh, useValue: mockPolymesh },
        { provide: Redis, useValue: mockRedis },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    processor = module.get<CddProcessor>(CddProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('processCdd', () => {
    it('should create CDD claim and clear previous link attempts', async () => {
      await processor.generateCdd(mockJob);

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

      await expect(processor.generateCdd(mockJob)).rejects.toThrow(testError);
    });
  });
});
