import {
  AddressApplicationsResponse,
  ApplicationInfo,
  EmailDetailsDto,
  ProviderLinkDto,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import crypto from 'node:crypto';
import { Logger } from 'winston';
import { CddApplicationModel } from '../app-redis/models/cdd-application.model';
import { AppRedisService } from '../app-redis/app-redis.service';
import { JumioService } from '../jumio/jumio.service';
import { MailchimpService } from '../mailchimp/mailchimp.service';
import { NetkiService } from '../netki/netki.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CddService {
  private fractalUrl: string;

  constructor(
    private readonly polymesh: Polymesh,
    private readonly jumioService: JumioService,
    private readonly netkiService: NetkiService,
    private readonly redisService: AppRedisService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly mailchimpService: MailchimpService,
    config: ConfigService
  ) {
    this.fractalUrl = config.get('fractalUrl') || '';
  }

  public async verifyAddress(address: string): Promise<VerifyAddressResponse> {
    if (!this.polymesh.accountManagement.isValidAddress({ address })) {
      throw new BadRequestException(
        'address is not valid ss58 for the configured network'
      );
    }

    const account = await this.polymesh.accountManagement
      .getAccount({
        address,
      })
      .catch((error) => {
        this.logger.error('error getting account', { address, error });

        throw error;
      });

    const [applications, identity] = await Promise.all([
      this.redisService.getApplications(address),
      account.getIdentity(),
    ]);

    if (identity) {
      const validCdd = await identity.hasValidCdd();
      return {
        valid: false,
        identity: { did: identity.did, validCdd },
      };
    }

    return { valid: true, identity: null, applications };
  }

  public async getProviderLink({
    address,
    provider,
  }: ProviderLinkDto): Promise<string> {
    const verify = await this.verifyAddress(address);
    if (!verify.valid) {
      throw new BadRequestException(
        `Address: ${address} cannot be onboarded. Perhaps it is already linked to an Identity`
      );
    }

    const id = crypto.randomUUID();
    let url, externalId;
    if (provider === 'jumio') {
      const jumioResponse = await this.jumioService.generateLink(address);

      url = jumioResponse.redirectUrl as string;
      externalId = jumioResponse.transactionReference as string;
    } else if (provider === 'netki') {
      const accessCode = await this.netkiService.allocateLinkForAddress(
        address
      );

      url = accessCode.url;
      externalId = accessCode.id;
    } else if (provider === 'fractal') {
      url = this.fractalUrl;
      externalId = '';
    } else if (provider === 'mock') {
      url = 'mock-cdd/';
      externalId = 'n/a';
    } else {
      this.logger.error(`unimplemented provider received: ${provider}`);
      throw new InternalServerErrorException();
    }

    const application: CddApplicationModel = {
      id,
      address,
      url,
      externalId,
      provider,
      timestamp: new Date().toISOString(),
    };

    this.redisService.setApplication(address, application);

    return application.url;
  }

  public async processEmail({
    email,
    newsletterAccepted,
    devUpdatesAccepted,
  }: EmailDetailsDto): Promise<void> {
    return this.mailchimpService.addSubscriberToMarketingList(
      email,
      'subscribed',
      newsletterAccepted,
      devUpdatesAccepted
    );
  }

  public async getApplications(
    address: string
  ): Promise<AddressApplicationsResponse> {
    const account = await this.polymesh.accountManagement.getAccount({
      address,
    });

    const [applications, identity] = await Promise.all([
      this.redisService.getApplications(address),
      account.getIdentity(),
    ]);

    // don't divulge created identities history, just in case
    const simplifiedApplications = identity
      ? []
      : applications.map(
          ({ provider, timestamp }) => new ApplicationInfo(provider, timestamp)
        );

    return new AddressApplicationsResponse(
      address,
      simplifiedApplications,
      identity?.did
    );
  }
}
