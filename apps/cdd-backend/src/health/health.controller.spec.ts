import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Logger } from 'winston';
import { InfoService } from '../info/info.service';
import { HealthController } from './health.controller';
import { HealthCheckResponse } from '@cdd-onboarding/cdd-types';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('HealthController', () => {
  let healthController: HealthController;
  let infoService: InfoService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: InfoService,
          useValue: createMock<InfoService>(),
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: createMock<Logger>(),
        },
        {
          provide: ALLOWED_IPS_PROVIDER,
          useValue: [],
        },
      ],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
    infoService = moduleRef.get<InfoService>(InfoService);
  });

  const healthCheckTestCases = [
    {
      name: 'getHealth',
      method: 'all',
      route: '/',
    },
    {
      name: 'getRedisHealth',
      method: 'redisInfo',
      route: '/redis',
    },
    {
      name: 'getNetworkHealth',
      method: 'polymeshInfo',
      route: '/network',
    },
    {
      name: 'getNetkiHealth',
      method: 'netkiInfo',
      route: '/netki',
    },
  ] as const;

  healthCheckTestCases.forEach(({ name, method, route }) => {
    describe(name, () => {
      it(`should return OK if ${route} health check is healthy`, async () => {
        const mockResult: HealthCheckResponse = { healthy: true };
        jest.spyOn(infoService, method).mockResolvedValue(mockResult);

        const result = await healthController[name]();
        expect(result).toBe('OK');
      });

      it(`should throw ServiceUnavailableException if ${route} health check is not healthy`, async () => {
        const mockResult: HealthCheckResponse = { healthy: false };
        jest.spyOn(infoService, method).mockResolvedValue(mockResult);

        await expect(healthController[name]()).rejects.toThrowError(
          'Service Unavailable'
        );
      });
    });
  });
});
