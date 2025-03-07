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
import { catchError, firstValueFrom } from 'rxjs';
import { Logger } from 'winston';
import { CddJob, ProviderEnum } from '../cdd-worker/types';
import { bullJobOptions } from '../config/consts';
import {
  FinclusiveAccessCode,
  FinclusiveAccessCodeTypeEnum,
  FinclusiveCallbackDto,
  FinclusiveClientDetails,
  FinclusiveCustomAttribute,
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

  private getWebformUrl(accessCode: FinclusiveAccessCode): string {
    let formPath = '';
    if (accessCode.type === FinclusiveAccessCodeTypeEnum.INDIVIDUAL) {
      formPath = '/individual.html';
    } else if (accessCode.type === FinclusiveAccessCodeTypeEnum.ENTITY) {
      formPath = '/entity.html';
    }

    return `${this.webformUrl}${formPath}?accessCode=${accessCode.value}`;
  }

  public async generateLink(
    type?: FinclusiveAccessCodeTypeEnum
  ): Promise<FinclusiveAccessCode & { url: string }> {
    const accessCode = await this.createAccessCode(type);

    return {
      ...accessCode,
      url: this.getWebformUrl(accessCode),
    };
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

  private async getClientDetails(
    clientId: string
  ): Promise<FinclusiveClientDetails> {
    await this.fetchAccessToken();

    const url = this.pathToUrl(
      `customer/${this.customerId}/client/${clientId}`
    );

    const headers = this.headers;

    const codeResponse = await firstValueFrom(
      this.http
        .get<FinclusiveClientDetails>(url, { headers })
        .pipe(catchError((error) => this.logError(error)))
    );

    if (!codeResponse?.data) {
      throw new InternalServerErrorException('Failed to create access code');
    }

    return codeResponse.data;
  }

  private async createAccessCode(
    type: FinclusiveAccessCodeTypeEnum = FinclusiveAccessCodeTypeEnum.INDIVIDUAL
  ): Promise<FinclusiveAccessCode> {
    await this.fetchAccessToken();

    const url = this.pathToUrl(
      `customer/WebformAccessCodeManagement/accesscode`
    );

    const headers = this.headers;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const body = {
      description: '',
      isMultipleUse: true,
      type,
      expiresAt: expiresAt.toISOString(),
    };

    const codeResponse = await firstValueFrom(
      this.http
        .post<FinclusiveAccessCode>(url, body, { headers })
        .pipe(catchError((error) => this.logError(error)))
    );

    if (!codeResponse?.data) {
      throw new InternalServerErrorException('Failed to create access code');
    }

    return codeResponse.data;
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

  public async queueCddJob(
    jobInfo: FinclusiveCallbackDto,
    notificationType: string
  ): Promise<void> {
    const clientDetails = await this.getClientDetails(jobInfo.FinClusiveID);

    const getAddress = (customAttributes: FinclusiveCustomAttribute[]) => {
      const address = customAttributes.find(
        (attribute) => attribute.name === 'Wallet ID'
      );

      return address?.value;
    };
    let type: ProviderEnum;
    let customAttributes: FinclusiveCustomAttribute[];
    let name: string;
    if (clientDetails.individual) {
      type = ProviderEnum.FINCLUSIVE;
      customAttributes = clientDetails.individual.customAttributes;
      name =
        clientDetails.individual.firstName +
        ' ' +
        clientDetails.individual.lastName;
    } else if (clientDetails.entity) {
      type = ProviderEnum.FINCLUSIVE_BUSINESS;
      customAttributes = clientDetails.entity.customAttributes;
      name = clientDetails.entity.legalName;
    } else {
      this.logger.error(
        'Finclusive client details did not have individual or entity',
        {
          jobInfo,
        }
      );

      return;
    }

    const address = getAddress(customAttributes);

    if (!address) {
      this.logger.error('Finclusive client details did not have address', {
        jobInfo,
      });

      return;
    }

    const job: CddJob = {
      type,
      value: {
        ...jobInfo,
        notificationType,
        address,
        name,
      },
    };

    await this.queue.add(job, bullJobOptions);
  }

  private async logError(error: Error) {
    this.logger.error(error.message, error.stack);
  }

  private pathToUrl(path: string): string {
    const url = new URL(path, this.baseUrl);

    return url.toString();
  }
}
