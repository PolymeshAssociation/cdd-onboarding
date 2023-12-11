import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { MockCddService } from './mock-cdd.service';
import { bullJobOptions } from '../config/consts';

describe('MockCddService', () => {
  let service: MockCddService;
  let mockQueue: DeepMocked<Queue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockCddService,
        {
          provide: getQueueToken(''),
          useValue: createMock<Queue>(),
        },
      ],
    }).compile();

    service = module.get<MockCddService>(MockCddService);
    mockQueue = module.get<typeof mockQueue>(getQueueToken(''));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('queueMockCddJob', () => {
    it('should queue the job', async () => {
      const mockJob = { address: 'someAddress', id: '1' };

      await service.queueMockCddJob(mockJob);

      expect(mockQueue.add).toHaveBeenCalledWith(
        {
          type: 'mock',
          value: mockJob,
        },
        bullJobOptions
      );
    });
  });
});
