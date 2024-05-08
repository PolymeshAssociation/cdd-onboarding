import { createMock, DeepMocked } from '@golevelup/ts-jest';
import Redis from 'ioredis';
import { Logger } from 'winston';
import { AppRedisService } from './app-redis.service';
import { CddApplicationModel } from './models/cdd-application.model';
import { NetkiAccessLinkModel } from './models/netki-access-link.model';
import { netkiAddressPrefixer, netkiAvailableCodesPrefix } from './utils';

describe('AppRedisService', () => {
  let redis: DeepMocked<Redis>;
  let logger: DeepMocked<Logger>;
  let service: AppRedisService;

  const address = 'someAddress';

  beforeEach(() => {
    redis = createMock<Redis>();
    logger = createMock<Logger>();

    service = new AppRedisService(redis, logger);
  });

  describe('applications', () => {
    const application = { id: 'someAppId' } as unknown as CddApplicationModel;
    const rawApplication = JSON.stringify(application);

    it('should set applications', async () => {
      service.setApplication(address, application);

      expect(redis.sadd).toBeCalledWith(address, JSON.stringify(application));
    });

    it('should get applications', async () => {
      redis.smembers.mockResolvedValue([rawApplication]);

      const result = await service.getApplications(address);

      expect(result).toEqual([application]);
    });

    it('should clear applications', async () => {
      await service.clearApplications(address);

      expect(redis.del).toHaveBeenCalledWith(address);
    });
  });

  describe('netkiCodesToAddress', () => {
    const code = 'someCode';
    const prefixedCode = netkiAddressPrefixer(code);

    it('should set codes', async () => {
      await service.setNetkiCodeToAddress('someCode', address);

      expect(redis.set).toHaveBeenCalledWith(prefixedCode, address);
    });

    it('should get codes', async () => {
      await service.getNetkiAddress(code);

      expect(redis.get).toHaveBeenCalledWith(prefixedCode);
    });

    it('should remove the address', async () => {
      await service.clearNetkiAddress(code);

      expect(redis.del).toHaveBeenCalledWith(prefixedCode);
    });
  });

  describe('netkiCodes', () => {
    const exampleCode = { code: 'someCode' } as unknown as NetkiAccessLinkModel;

    it('should add codes', async () => {
      redis.sadd.mockResolvedValue(1);

      const result = await service.pushNetkiCodes([exampleCode]);

      expect(redis.sadd).toHaveBeenCalledWith(netkiAvailableCodesPrefix, [
        JSON.stringify(exampleCode),
      ]);
      expect(result).toEqual(1);
    });
  });

  describe('getAccessCodeCount', () => {
    it('should return code count', async () => {
      redis.scard.mockResolvedValue(3);

      const result = await service.getAccessCodeCount();

      expect(result).toEqual(3);
    });
  });

  describe('availableNetkiCodeCount', () => {
    it('should return the count from scard', async () => {
      redis.scard.mockResolvedValue(7);

      const result = await service.availableNetkiCodeCount();

      expect(result).toEqual(7);
    });
  });

  describe('isHealthy', () => {
    it('should return true is ping resolves', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      redis.ping.mockResolvedValue('mockResponse' as any);

      const result = await service.isHealthy();

      expect(result).toEqual(true);
    });

    it('should return false if ping throws', async () => {
      redis.ping.mockRejectedValue(new Error('some error'));

      const result = await service.isHealthy();

      expect(result).toEqual(false);
    });
  });
});
