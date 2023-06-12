import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppRedisService } from '../app-redis/app-redis.service';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;
  let mockRedis: DeepMocked<AppRedisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: AppRedisService,
          useValue: createMock<AppRedisService>(),
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    mockRedis = module.get<typeof mockRedis>(AppRedisService);
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
});
