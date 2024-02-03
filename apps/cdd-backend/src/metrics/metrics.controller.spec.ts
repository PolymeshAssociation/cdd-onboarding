import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let mockService: DeepMocked<MetricsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        { provide: MetricsService, useValue: createMock<MetricsService>() },
        { provide: ALLOWED_IPS_PROVIDER, useValue: [] },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    mockService = module.get<typeof mockService>(MetricsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('netki-codes', () => {
    it('should call and return the service result', async () => {
      mockService.getNetkiAvailableCodeCount.mockResolvedValue({ count: 7 });

      const result = await controller.getNetkiCodeCount();

      expect(result).toEqual({ count: 7 });
    });
  });

  describe('job stats', () => {
    it('should call and return the service result', async () => {
      mockService.getJobQueueStats.mockResolvedValue({
        active: 1,
        completed: 2,
        failed: 3,
        waiting: 4,
        oldestSeconds: 5,
      });

      const result = await controller.getJobQueueStats();

      expect(result).toEqual({
        active: 1,
        completed: 2,
        failed: 3,
        waiting: 4,
        oldestSeconds: 5,
      });
    });
  });
});
