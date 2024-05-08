import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CddApplicationModel } from './models/cdd-application.model';
import { NetkiAccessLinkModel } from './models/netki-access-link.model';
import { NetkiBusinessApplicationModel } from './models/netki-business-application.model';
import {
  netkiAllocatedCodePrefix,
  netkiAvailableCodesPrefix,
  netkiAddressPrefixer,
  netkiBusinessAppPrefixer,
  netkiBusinessAppPrefix,
  netkiBusinessToAddressPrefixer,
} from './utils';

@Injectable()
export class AppRedisService {
  constructor(
    private readonly redis: Redis,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async getApplications(address: string): Promise<CddApplicationModel[]> {
    const rawApplications = await this.redis.smembers(address);

    return rawApplications.map((application) => JSON.parse(application));
  }

  async setApplication(
    id: string,
    application: CddApplicationModel
  ): Promise<void> {
    await this.redis.sadd(id, JSON.stringify(application));
  }

  async clearApplications(address: string): Promise<void> {
    await this.redis.del(address);
  }

  async setNetkiCodeToAddress(code: string, address: string): Promise<void> {
    const prefixedKey = netkiAddressPrefixer(code);

    this.logger.debug('allocating netki code for address', { code, address });

    await this.redis.set(prefixedKey, address);
  }

  async setNetkiCodeToBusiness(
    code: string,
    application: NetkiBusinessApplicationModel
  ): Promise<void> {
    const prefixedKey = netkiBusinessAppPrefixer(code);

    this.logger.debug('allocating netki code for business', {
      code,
      applicationId: application.id,
    });

    await this.redis.set(prefixedKey, JSON.stringify(application));
  }

  async getNetkiAddress(code: string): Promise<string | null> {
    const netkiAccessCodeKey = netkiAddressPrefixer(code);

    return this.redis.get(netkiAccessCodeKey);
  }

  async getNetkiBusinessApplication(
    code: string
  ): Promise<NetkiBusinessApplicationModel | null> {
    const businessKey = netkiBusinessAppPrefixer(code);

    const result = await this.redis.get(businessKey);

    return result ? JSON.parse(result) : null;
  }

  async clearNetkiAddress(code: string): Promise<void> {
    const netkiAccessCodeKey = netkiAddressPrefixer(code);

    await this.redis.del(netkiAccessCodeKey);
  }

  async pushNetkiCodes(newCodes: NetkiAccessLinkModel[]): Promise<number> {
    const added = await this.redis.sadd(
      netkiAvailableCodesPrefix,
      newCodes.map((link) => JSON.stringify(link))
    );

    this.logger.info('added new netki codes', {
      attemptedToAdd: newCodes.length,
      added,
    });

    return added;
  }

  async getAccessCodeCount(): Promise<number> {
    return this.redis.scard(netkiAvailableCodesPrefix);
  }

  async popNetkiAccessLink(): Promise<NetkiAccessLinkModel | null> {
    const [rawCode] = await this.redis.spop(netkiAvailableCodesPrefix, 1);

    if (!rawCode) {
      return null;
    }

    return JSON.parse(rawCode);
  }

  async getAllocatedNetkiCodes(): Promise<Set<string>> {
    const [allocatedIndividualCodes, allocatedBusinessCodes] =
      await Promise.all([
        this.redis.keys(`${netkiAllocatedCodePrefix}*`),
        this.redis.keys(`${netkiBusinessAppPrefix}*`),
      ]);

    return new Set(
      [...allocatedIndividualCodes, ...allocatedBusinessCodes].map((code) =>
        code
          .replace(netkiAllocatedCodePrefix, '')
          .replace(netkiBusinessAppPrefix, '')
      )
    );
  }

  async setBusinessIdToAddress(
    businessId: string,
    address: string
  ): Promise<void> {
    const prefixedKey = netkiBusinessToAddressPrefixer(businessId);

    this.logger.debug('associating netki business ID to address', {
      businessId,
      address,
    });

    await this.redis.set(prefixedKey, address);
  }

  async getNetkiBusinessAddress(businessId: string): Promise<string | null> {
    const businessKey = netkiBusinessToAddressPrefixer(businessId);

    return this.redis.get(businessKey);
  }

  async availableNetkiCodeCount(): Promise<number> {
    return await this.redis.scard(netkiAvailableCodesPrefix);
  }

  async isHealthy(): Promise<boolean> {
    let healthy = true;

    await this.redis.ping().catch(() => {
      healthy = false;
    });

    return healthy;
  }
}
