import {
  BusinessLinkDto,
  HealthCheckResponse,
} from '@cdd-onboarding/cdd-types';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import crypto from 'node:crypto';
import { catchError, firstValueFrom } from 'rxjs';
import { Logger } from 'winston';
import { AppRedisFinclusiveService } from '../app-redis/app-redis-finclusive.service';
import { FinclusiveBusinessApplicationModel } from '../app-redis/models/finclusive-business-application.model';
import {
  FinclusiveAccessCodeModel,
  FinclusiveAccessCodeTypeEnum,
} from './../app-redis/models/finclusive-access-code.model';
import {
  FinclusiveAccessCode,
  FinclusiveEntityInfo,
  FinclusiveEntityInfoPageResponse,
  FinclusiveFetchCodesResponse,
} from './types';

@Injectable()
export class FinclusiveService {
  private readonly baseUrl: string;
  private readonly customerId: string;
  private readonly webformUrl: string;
  private readonly oauthUrl: string;
  private readonly clientId: string;
  private readonly partnerId: string;
  private readonly subscriptionKey: string;
  private expiresAt?: Date;

  private readonly userAuth: { username: string; password: string };
  private accessToken = '';

  constructor(
    private readonly redis: AppRedisFinclusiveService,
    private readonly http: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectQueue('') private readonly queue: Queue,
    config: ConfigService
  ) {
    this.baseUrl = config.getOrThrow('finclusive.url');
    this.customerId = config.getOrThrow('finclusive.customerId');
    this.userAuth = {
      username: config.getOrThrow('finclusive.username'),
      password: config.getOrThrow('finclusive.password'),
    };
    this.webformUrl = config.getOrThrow('finclusive.webformUrl');
    this.oauthUrl = config.getOrThrow('finclusive.oauthUrl');
    this.clientId = config.getOrThrow('finclusive.clientId');
    this.partnerId = config.getOrThrow('finclusive.partnerId');
    this.subscriptionKey = config.getOrThrow('finclusive.subscriptionKey');
  }

  public async allocateLinkForAddress(
    address: string
  ): Promise<FinclusiveAccessCodeModel & { url: string }> {
    const accessCode = await this.redis.popAccessCode();

    if (!accessCode) {
      throw new InternalServerErrorException('Finclusive codes exhausted');
    }

    // based on type of the access code, we can add entity.html or individual.html to the url. Where type is both, no need to add anything
    const url = `${this.webformUrl}?accessCode=${accessCode.value}`;

    await this.redis.setCodeToAddress(accessCode.value, address);

    return {
      ...accessCode,
      url,
    };
  }

  public async allocateLinkForBusiness(
    data: BusinessLinkDto
  ): Promise<FinclusiveBusinessApplicationModel> {
    const id = crypto.randomUUID();
    const accessCode = await this.redis.popAccessCode();

    if (!accessCode) {
      throw new InternalServerErrorException('Finclusive codes exhausted');
    }

    const link = `${this.webformUrl}?access_code=${accessCode.value}`;

    const finclusiveApplication: FinclusiveBusinessApplicationModel = {
      id,
      link,
      address: data.address,
      accessCode: accessCode.value,
      timestamp: new Date().toISOString(),
    };

    await this.redis.setCodeToBusiness(accessCode.value, finclusiveApplication);

    return finclusiveApplication;
  }

  public async healthCheck(): Promise<string> {
    await this.fetchAccessToken();

    const url = this.pathToUrl('customer/healthcheck');
    const headers = this.headers;

    const healthCheckResponse = await firstValueFrom(
      this.http.get<string>(url, { headers })
    );

    if (healthCheckResponse.status !== 200) {
      throw new Error('Finclusive health check failed');
    }

    return healthCheckResponse.data;
  }

  // TODO update according to finclusive api
  public async getBusinessInfo(): Promise<FinclusiveEntityInfo> {
    await this.fetchAccessToken();

    const url = this.pathToUrl(`customer/${this.customerId}/client/all`);
    const headers = this.headers;

    const businessInfoPage = await firstValueFrom(
      this.http.get<FinclusiveEntityInfoPageResponse>(url, { headers })
    );

    if (businessInfoPage.data.results.length === 0) {
      throw new Error('no business info was present');
    }

    return businessInfoPage.data.results[0];
  }

  public async fetchAccessCodes(): Promise<FinclusiveFetchCodesResponse> {
    const url: string = this.pathToUrl(
      '/customer/WebformAccessCodeManagement/all'
    );

    const allocatedCodes = await this.redis.getAllocatedCodes();

    let added = 0;
    await this.fetchAccessToken();

    const { headers } = this;

    const codeResponse = await firstValueFrom(
      this.http
        .get<FinclusiveAccessCode[]>(url, { headers })
        .pipe(catchError((error) => this.logError(error)))
    );

    if (!codeResponse?.data) {
      this.logError(new Error('no results were present in fetch response'));
      throw new InternalServerErrorException();
    }

    const newLinks = codeResponse?.data
      .filter(
        // filter any code that has been allocated
        // TODO: add more filtering checks
        ({ value }) => !allocatedCodes.has(value)
      )
      .map(
        ({
          value,
          expiresAt,
          isMultipleUse,
          timesUsed,
          type,
        }: FinclusiveAccessCode) => ({
          value,
          expiresAt: new Date(expiresAt),
          isMultipleUse,
          timesUsed,
          type: type as FinclusiveAccessCodeTypeEnum,
        })
      );

    if (newLinks.length) {
      const codesAdded = await this.redis.pushCodes(newLinks);
      added += codesAdded;
    }

    const total = await this.redis.getAccessCodeCount();

    return { added, total };
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
    };
  }

  private async fetchAccessToken(): Promise<void> {
    if (this.accessToken) {
      const oneSecondLater = new Date();
      oneSecondLater.setSeconds(oneSecondLater.getSeconds() + 20);
      if (this.expiresAt && this.expiresAt > oneSecondLater) {
        return;
      }
    }

    const url = new URL(`${this.oauthUrl}/oauth2/v2.0/token`);
    url.searchParams.set('client_id', this.clientId);
    url.searchParams.set('username', encodeURI(this.userAuth.username));
    url.searchParams.set('password', encodeURI(this.userAuth.password));
    url.searchParams.set('p', this.partnerId);
    url.searchParams.set('scope', `openid ${this.clientId} offline_access`);
    url.searchParams.set('grant_type', 'password');
    url.searchParams.set('response_type', 'token id_token');

    const authResponse = await firstValueFrom(
      this.http
        .post(url.toString())
        .pipe(catchError((error) => this.logError(error)))
    );

    if (authResponse?.data?.access_token) {
      this.accessToken = authResponse.data.access_token;
      this.expiresAt = new Date(
        Date.now() + authResponse.data.expires_in * 1000
      );
    } else {
      const error = new Error(
        'refresh access token response did not have `access_token` property'
      );
      this.logError(error);

      throw error;
    }
  }

  // public async queueCddJob(jobInfo: FinclusiveCallbackDto): Promise<void> {
  //   const job: CddJob = {
  //     type: ProviderEnum.FINCLUSIVE,
  //     value: jobInfo,
  //   };

  //   await this.queue.add(job, bullJobOptions);
  // }

  // public async queueBusinessJob(
  //   jobInfo: FinclusiveBusinessCallbackDto
  // ): Promise<void> {
  //   const job: CddJob = {
  //     type: ProviderEnum.FINCLUSIVE_BUSINESS,
  //     value: jobInfo,
  //   };

  //   await this.queue.add(job, bullJobOptions);
  // }

  private async logError(error: Error) {
    this.logger.error(error.message, error.stack);
  }

  private pathToUrl(path: string): string {
    const url = new URL(path, this.baseUrl);

    return url.toString();
  }
}
