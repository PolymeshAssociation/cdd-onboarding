import { GenerateCddDto, ProviderLinkDto } from '@cdd-onboarding/cdd-types';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Queue } from 'bull';
import crypto from 'node:crypto';

@Injectable()
export class CddService {
  constructor(
    private readonly sdk: Polymesh,
    @InjectQueue('cdd') private readonly queue: Queue
  ) {}

  public async verifyAddress(address: string): Promise<boolean> {
    const account = await this.sdk.accountManagement.getAccount({ address });

    const identity = await account.getIdentity();
    if (identity) {
      return false;
    }

    return true;
  }

  public async generateProviderLink({
    address,
    provider,
  }: ProviderLinkDto): Promise<string> {
    return `http://example.com/${address}/${provider}`;
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
