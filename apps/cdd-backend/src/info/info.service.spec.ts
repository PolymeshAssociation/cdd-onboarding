import { HealthCheckResponse } from '@cdd-onboarding/cdd-types';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { BigNumber, Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Redis } from 'ioredis';
import { JumioService } from '../jumio/jumio.service';
import { MailchimpService } from '../mailchimp/mailchimp.service';
import { NetkiService } from '../netki/netki.service';
import { MockPolymesh } from '../test-utils/mocks';
import { InfoService } from './info.service';
import { PolymeshNetworkResponse } from './types';

const healthyResponse = new HealthCheckResponse(true);
const unhealthyResponse = new HealthCheckResponse(false);

const meshResponse = new PolymeshNetworkResponse(
  new BigNumber(42),
  new BigNumber(211),
  {
    name: 'test',
    version: new BigNumber(1),
  }
);
const meshHealthy = new HealthCheckResponse<PolymeshNetworkResponse>(
  true,
  meshResponse
);

describe('InfoService', () => {
  let service: InfoService;
  let mockPolymesh: MockPolymesh;
  let mockJumio: DeepMocked<JumioService>;
  let mockNetki: DeepMocked<NetkiService>;
  let mockRedis: DeepMocked<Redis>;
  let mockMailchimpService: DeepMocked<MailchimpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfoService,
        { provide: Polymesh, useValue: new MockPolymesh() },
        { provide: NetkiService, useValue: createMock<NetkiService>() },
        { provide: JumioService, useValue: createMock<JumioService>() },
        { provide: Redis, useValue: createMock<Redis>() },
        { provide: MailchimpService, useValue: createMock<MailchimpService>() },
      ],
    }).compile();

    service = module.get<InfoService>(InfoService);
    mockPolymesh = module.get<MockPolymesh>(Polymesh);
    mockJumio = module.get<typeof mockJumio>(JumioService);
    mockNetki = module.get<typeof mockNetki>(NetkiService);
    mockRedis = module.get<typeof mockRedis>(Redis);
    mockMailchimpService = module.get<typeof mockMailchimpService>(MailchimpService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('method: all', () => {
    it('should return a healthy response if all services are healthy', async () => {
      const spies = [
        jest.spyOn(service, 'jumioInfo').mockResolvedValue(healthyResponse),
        jest.spyOn(service, 'polymeshInfo').mockResolvedValue(meshHealthy),
        jest.spyOn(service, 'redisInfo').mockResolvedValue(healthyResponse),
        jest.spyOn(service, 'netkiInfo').mockResolvedValue(healthyResponse),
        jest.spyOn(service,'mailchimpInfo').mockResolvedValue(healthyResponse),
      ];

      const result = await service.all();
      expect(result.healthy).toEqual(true);

      spies.forEach((spy) => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it("should return unhealthy if a single service isn't healthy", async () => {
      const spies = [
        jest.spyOn(service, 'jumioInfo').mockResolvedValue(unhealthyResponse),
        jest.spyOn(service, 'polymeshInfo').mockResolvedValue(meshHealthy),
        jest.spyOn(service, 'redisInfo').mockResolvedValue(healthyResponse),
        jest.spyOn(service, 'netkiInfo').mockResolvedValue(healthyResponse),
        jest.spyOn(service,'mailchimpInfo').mockResolvedValue(healthyResponse),
      ];

      const result = await service.all();
      expect(result.healthy).toEqual(false);

      spies.forEach((spy) => {
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('method: polymeshInfo', () => {
    it('should return healthy if no SDK methods throw', async () => {
      mockPolymesh.network.getSs58Format.mockReturnValue(new BigNumber(42));
      mockPolymesh.network.getLatestBlock.mockResolvedValue(new BigNumber(211));
      mockPolymesh.network.getNetworkProperties.mockResolvedValue({
        name: 'test',
        version: new BigNumber(1),
      });
      const response = await service.polymeshInfo();

      expect(response).toEqual({
        healthy: true,
        data: meshHealthy.data,
      });
    });
  });

  it('should return healthy if no SDK methods throw', async () => {
    mockPolymesh.network.getLatestBlock.mockRejectedValue(
      new Error('someError')
    );

    const meshUnhealthy = new HealthCheckResponse(false, {
      latestBlockNumber: undefined,
      network: undefined,
      ss58Format: undefined,
    });
    const response = await service.polymeshInfo();

    expect(response).toEqual(meshUnhealthy);
  });

  describe('method: jumioInfo', () => {
    it('should return healthy if jumio service is ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockJumio.generateLink.mockResolvedValue('mockResponse' as any);

      const response = await service.jumioInfo();

      expect(response).toEqual(new HealthCheckResponse(true));
    });

    it('should return unhealthy if jumio service is not ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockJumio.generateLink.mockRejectedValue(new Error('some error'));

      const response = await service.jumioInfo();

      expect(response).toEqual(new HealthCheckResponse(false));
    });
  });

  describe('method: netkiInfo', () => {
    it('should return healthy if netki service is ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockNetki.getBusinessInfo.mockResolvedValue('mockResponse' as any);

      const response = await service.netkiInfo();

      expect(response).toEqual(new HealthCheckResponse(true));
    });

    it('should return unhealthy if netki service is not ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockNetki.getBusinessInfo.mockRejectedValue(new Error('some error'));

      const response = await service.netkiInfo();

      expect(response).toEqual(new HealthCheckResponse(false));
    });
  });

  describe('method: redisInfo', () => {
    it('should return healthy if redis is ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockRedis.ping.mockResolvedValue('mockResponse' as any);

      const response = await service.redisInfo();

      expect(response).toEqual(new HealthCheckResponse(true));
    });

    it('should return unhealthy if redis is not ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockRedis.ping.mockRejectedValue(new Error('some error'));

      const response = await service.redisInfo();

      expect(response).toEqual(new HealthCheckResponse(false));
    });
  });

  describe('method: mailchimpInfo', () => {
    it('should return healthy if mailchimp is ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockMailchimpService.ping.mockResolvedValue('mockResponse' as any);

      const response = await service.mailchimpInfo();

      expect(response).toEqual(new HealthCheckResponse(true));
    });

    it('should return unhealthy if mailchimp is not ok', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockMailchimpService.ping.mockRejectedValue(new Error('some error'));

      const response = await service.mailchimpInfo();

      expect(response).toEqual(new HealthCheckResponse(false));
    });
  });
});
