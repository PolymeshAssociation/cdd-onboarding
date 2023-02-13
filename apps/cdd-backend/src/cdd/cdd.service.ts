import {
  ProviderLinkDto,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import Redis from 'ioredis';
import crypto from 'node:crypto';
import { CddApplication } from '../cdd-worker/types';
import { JumioService } from '../jumio/jumio.service';
import { NetkiService } from '../netki/netki.service';

@Injectable()
export class CddService {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly jumioService: JumioService,
    private readonly netkiService: NetkiService,
    private readonly redis: Redis,
    private readonly logger: Logger
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

  public async getProviderLink({
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
    let url, externalId;

    if (provider === 'jumio') {
      const jumioResponse = await this.jumioService.generateLink(id, address);

      url = jumioResponse.redirectUrl as string;
      externalId = jumioResponse.transactionReference as string;
    } else if (provider === 'netki') {
      const accessCode = await this.netkiService.popLink(address);

      url = accessCode.url;
      externalId = accessCode.id;
    } else {
      this.logger.error(`unimplemented provider received: ${provider}`);
      throw new InternalServerErrorException();
    }

    const application: CddApplication = {
      id,
      address,
      url,
      externalId,
      provider,
      timestamp: new Date().toISOString(),
    };

    this.redis.sadd(address, JSON.stringify(application));

    return application.url;
  }
}
