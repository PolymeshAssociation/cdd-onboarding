import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CddApplicationModel } from './models/cdd-application.model';
import { NetkiAccessLinkModel } from './models/netki-access-link.model';
import {
  netkiAllocatedCodePrefix,
  netkiAvailableCodesPrefix,
  netkiAddressPrefixer,
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
    address: string,
    application: CddApplicationModel
  ): Promise<void> {
    await this.redis.sadd(address, JSON.stringify(application));
  }

  async clearApplications(address: string): Promise<void> {
    await this.redis.del(address);
  }

  async setNetkiCodeToAddress(code: string, address: string): Promise<void> {
    const prefixedKey = netkiAddressPrefixer(code);

    await this.redis.set(prefixedKey, address);
  }

  async getNetkiAddress(code: string): Promise<string | null> {
    const netkiAccessCodeKey = netkiAddressPrefixer(code);

    return this.redis.get(netkiAccessCodeKey);
  }

  async clearNetkiAddress(code: string): Promise<void> {
    const netkiAccessCodeKey = netkiAddressPrefixer(code);

    await this.redis.del(netkiAccessCodeKey);
  }

  async pushNetkiCodes(
    newCodes: NetkiAccessLinkModel[]
  ): Promise<{ added: number; total: number }> {
    const added = await this.redis.sadd(
      netkiAvailableCodesPrefix,
      newCodes.map((link) => JSON.stringify(link))
    );

    const total = await this.redis.scard(netkiAvailableCodesPrefix);

    this.logger.info('added new netki codes', {
      attemptedToAdd: newCodes.length,
      added,
      total,
    });

    return { added, total };
  }

  async popNetkiAccessLink(): Promise<NetkiAccessLinkModel | null> {
    const [rawCode] = await this.redis.spop(netkiAvailableCodesPrefix, 1);

    if (!rawCode) {
      return null;
    }

    return JSON.parse(rawCode);
  }

  async allocateNetkiCode(code: string, address: string): Promise<void> {
    await this.setNetkiCodeToAddress(code, address);

    const key = netkiAddressPrefixer(code);
    this.logger.info('allocating netki code for address', { code, address });
    await this.redis.set(key, address);
  }

  async getAllocatedNetkiCodes(): Promise<Set<string>> {
    const allocatedCodes = await this.redis.keys(
      `${netkiAllocatedCodePrefix}*`
    );

    return new Set(
      allocatedCodes.map((code) => code.replace(netkiAllocatedCodePrefix, ''))
    );
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
