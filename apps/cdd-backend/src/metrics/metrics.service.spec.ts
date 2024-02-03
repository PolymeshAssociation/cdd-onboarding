import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppRedisService } from '../app-redis/app-redis.service';
import { MetricsService } from './metrics.service';
import { getQueueToken } from '@nestjs/bull';
import { Job, Queue } from 'bull';

describe('MetricsService', () => {
  let service: MetricsService;
  let mockRedis: DeepMocked<AppRedisService>;
  let mockQueue: DeepMocked<Queue>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: AppRedisService,
          useValue: createMock<AppRedisService>(),
        },
        {
          provide: getQueueToken(),
          useValue: createMock<Queue>(),
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    mockRedis = module.get<typeof mockRedis>(AppRedisService);
    mockQueue = module.get<typeof mockQueue>(getQueueToken(''));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNetkiAvailableCodeCount', () => {
    it('should call and return the count from redis', async () => {
      mockRedis.availableNetkiCodeCount.mockResolvedValue(7);

      const result = await service.getNetkiAvailableCodeCount();

      expect(result).toEqual({ count: 7 });
    });
  });

  describe('getNetkiAvailableCodeCount', () => {
    it('should call and return the count from redis', async () => {
      mockQueue.getActiveCount.mockResolvedValue(1);
      mockQueue.getCompletedCount.mockResolvedValue(2);
      mockQueue.getFailedCount.mockResolvedValue(3);
      mockQueue.getWaitingCount.mockResolvedValue(4);
      mockQueue.getWaiting.mockResolvedValue([
        {
          timestamp: 1,
        } as Job,
      ]);

      const result = await service.getJobQueueStats();

      expect(result).toEqual({
        active: 1,
        completed: 2,
        failed: 3,
        waiting: 4,
        oldestSeconds: expect.any(Number),
      });
    });
  });
});
