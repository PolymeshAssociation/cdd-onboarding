import {
  GenerateCddDto,
  ProviderLinkDto,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Queue } from 'bull';
import Redis from 'ioredis';
import crypto from 'node:crypto';

@Injectable()
export class CddService {
  constructor(
    private readonly polymesh: Polymesh,
    @InjectQueue('cdd') private readonly queue: Queue,
    private readonly redis: Redis
  ) {}

  public async verifyAddress(address: string): Promise<VerifyAddressResponse> {
    const account = await this.polymesh.accountManagement.getAccount({
      address,
    });

    const identity = await account.getIdentity();
    if (identity) {
      return { valid: false, previousLinks: [] };
    }

    const previousLinks = await this.redis.smembers(address);

    return { valid: true, previousLinks };
  }

  public async generateProviderLink({
    address,
    provider,
  }: ProviderLinkDto): Promise<string> {
    const link = `http://example.com/${address}/${provider}`;
    this.redis.sadd(address, link);

    return link;
  }

  public async queueCddRequest({ address }: GenerateCddDto): Promise<string> {
    const id = crypto.randomUUID();

    await this.queue.add('cdd', {
      id,
      address,
    });

    return id;
  }
}
