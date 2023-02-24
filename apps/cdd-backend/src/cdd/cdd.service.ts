import {
  ProviderLinkDto,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';
import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Queue } from 'bull';
import Redis from 'ioredis';
import crypto from 'node:crypto';
import { CddApplication } from '../cdd-worker/types';
import { JumioService } from '../jumio/jumio.service';

@Injectable()
export class CddService {
  private readonly logger = new Logger(CddService.name);

  constructor(
    private readonly polymesh: Polymesh,
    private readonly jumioService: JumioService,
    @InjectQueue() private readonly queue: Queue,
    private readonly redis: Redis
  ) {}

  public async verifyAddress(address: string): Promise<VerifyAddressResponse> {
    const account = await this.polymesh.accountManagement
      .getAccount({
        address,
      })
      .catch((error) => {
        this.logger.error(
          `problem getting account for address: "${address}": ${error.message}`,
          error.stack
        );

        throw error;
      });

    const identity = await account.getIdentity();
    if (identity) {
      return { valid: false, previousLinks: [] };
    }

    const rawApplications = await this.redis.smembers(address);

    const previousLinks = rawApplications.map(
      (rawApp) => JSON.parse(rawApp).link
    );

    return { valid: true, previousLinks };
  }

  public async generateProviderLink({
    address,
    provider,
  }: ProviderLinkDto): Promise<string> {
    const verify = await this.verifyAddress(address);

    if (!verify.valid) {
      throw new BadRequestException(
        `Address: ${address} is not valid to be onboarded. Perhaps it is already linked to an Identity`
      );
    }

    const id = crypto.randomUUID();

    const application: CddApplication = {
      id,
      address,
      link: `http://example.com/${address}/${provider}`,
      provider,
      timestamp: new Date(),
      externalReference: '',
    };

    if (provider === 'jumio') {
      const jumioResponse = await this.jumioService.generateLink(id, address);
      application.link = jumioResponse.redirectUrl as string;
      application.timestamp = jumioResponse.timestamp as Date;
      application.externalReference =
        jumioResponse.transactionReference as string;
    }

    this.redis.sadd(address, JSON.stringify(application));

    return application.link;
  }
}
