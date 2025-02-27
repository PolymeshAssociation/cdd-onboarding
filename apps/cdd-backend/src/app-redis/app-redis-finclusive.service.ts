import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  finclusiveAddressPrefixer,
  finclusiveAllocatedCodePrefix,
  finclusiveAvailableCodesPrefix,
  finclusiveBusinessAppPrefix,
  finclusiveBusinessAppPrefixer,
  finclusiveBusinessToAddressPrefixer,
} from './utils';
import { FinclusiveAccessCodeModel } from './models/finclusive-access-code.model';
import { FinclusiveBusinessApplicationModel } from './models/finclusive-business-application.model';

@Injectable()
export class AppRedisFinclusiveService {
  constructor(
    private readonly redis: Redis,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async setCodeToAddress(code: string, address: string): Promise<void> {
    const prefixedKey = finclusiveAddressPrefixer(code);

    this.logger.debug('allocating finclusive code for address', {
      code,
      address,
    });

    await this.redis.set(prefixedKey, address);
  }

  async setCodeToBusiness(
    code: string,
    application: FinclusiveBusinessApplicationModel
  ): Promise<void> {
    const prefixedKey = finclusiveBusinessAppPrefixer(code);

    this.logger.debug('allocating finclusive code for business', {
      code,
      applicationId: application.id,
    });

    await this.redis.set(prefixedKey, JSON.stringify(application));
  }

  async getAddress(code: string): Promise<string | null> {
    const finclusiveAccessCodeKey = finclusiveAddressPrefixer(code);

    return this.redis.get(finclusiveAccessCodeKey);
  }

  async getBusinessApplication(
    code: string
  ): Promise<FinclusiveBusinessApplicationModel | null> {
    const businessKey = finclusiveBusinessAppPrefixer(code);

    const result = await this.redis.get(businessKey);

    return result ? JSON.parse(result) : null;
  }

  async clearAddress(code: string): Promise<void> {
    const finclusiveAccessCodeKey = finclusiveAddressPrefixer(code);

    await this.redis.del(finclusiveAccessCodeKey);
  }

  async pushCodes(newCodes: FinclusiveAccessCodeModel[]): Promise<number> {
    const added = await this.redis.sadd(
      finclusiveAvailableCodesPrefix,
      newCodes.map((link) => JSON.stringify(link))
    );

    this.logger.info('added new finclusive codes', {
      attemptedToAdd: newCodes.length,
      added,
    });

    return added;
  }

  async getAccessCodeCount(): Promise<number> {
    return this.redis.scard(finclusiveAvailableCodesPrefix);
  }

  async popAccessCode(): Promise<FinclusiveAccessCodeModel | null> {
    const [rawCode] = await this.redis.spop(finclusiveAvailableCodesPrefix, 1);

    if (!rawCode) {
      return null;
    }

    return JSON.parse(rawCode);
  }

  async getAllocatedCodes(): Promise<Set<string>> {
    const [allocatedIndividualCodes, allocatedBusinessCodes] =
      await Promise.all([
        this.redis.keys(`${finclusiveAllocatedCodePrefix}*`),
        this.redis.keys(`${finclusiveBusinessAppPrefix}*`),
      ]);

    return new Set(
      [...allocatedIndividualCodes, ...allocatedBusinessCodes].map((code) =>
        code
          .replace(finclusiveAllocatedCodePrefix, '')
          .replace(finclusiveBusinessAppPrefix, '')
      )
    );
  }

  async setBusinessIdToAddress(
    businessId: string,
    address: string
  ): Promise<void> {
    const prefixedKey = finclusiveBusinessToAddressPrefixer(businessId);

    this.logger.debug('associating finclusive business ID to address', {
      businessId,
      address,
    });

    await this.redis.set(prefixedKey, address);
  }

  async getBusinessAddress(businessId: string): Promise<string | null> {
    const businessKey = finclusiveBusinessToAddressPrefixer(businessId);

    return this.redis.get(businessKey);
  }

  async availableCodeCount(): Promise<number> {
    return await this.redis.scard(finclusiveAvailableCodesPrefix);
  }
}
