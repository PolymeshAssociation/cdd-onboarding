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
import { AppRedisService } from '../app-redis/app-redis.service';
import { NetkiAccessLinkModel } from '../app-redis/models/netki-access-link.model';
import { CddJob } from '../cdd-worker/types';
import { getExpiryFromJwt } from '../common/utils';
import {
  NetkiAccessCode,
  NetkiAccessCodePageResponse,
  NetkiCallbackDto,
  NetkiFetchCodesResponse,
  NetkiBusinessInfoPageResponse,
  NetkiBusinessInfo,
  NetkiBusinessCallbackDto,
} from './types';
import crypto from 'node:crypto';
import { bullJobOptions } from '../config/consts';
import { NetkiBusinessApplicationModel } from '../app-redis/models/netki-business-application.model';
import { BusinessLinkDto } from '@cdd-onboarding/cdd-types';

@Injectable()
export class NetkiService {
  private baseUrl: string;
  private linkBaseUrl: string;
  private businessBaseUrl: string;
  private readonly businessId: string;
  private userAuth: { username: string; password: string };
  private accessToken = '';

  constructor(
    private readonly redis: AppRedisService,
    private readonly http: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectQueue('') private readonly queue: Queue,
    config: ConfigService
  ) {
    this.businessId = config.getOrThrow('netki.businessId');
    this.baseUrl = config.getOrThrow('netki.url');
    this.linkBaseUrl = config.getOrThrow('netki.linkUrl');
    this.businessBaseUrl = config.get('netki.businessLinkUrl') ?? '';
    this.userAuth = {
      username: config.getOrThrow('netki.username'),
      password: config.getOrThrow('netki.password'),
    };
  }

  public async allocateLinkForAddress(
    address: string
  ): Promise<NetkiAccessLinkModel & { url: string }> {
    const accessCode = await this.redis.popNetkiAccessLink();

    if (!accessCode) {
      throw new InternalServerErrorException('Netki codes exhausted');
    }

    const url = `${this.linkBaseUrl}?service_code=${accessCode.code}&applicationId=${address}`;

    await this.redis.setNetkiCodeToAddress(accessCode.code, address);

    return {
      ...accessCode,
      url,
    };
  }

  public async allocateLinkForBusiness(
    data: BusinessLinkDto
  ): Promise<NetkiBusinessApplicationModel> {
    const id = crypto.randomUUID();
    const accessCode = await this.redis.popNetkiAccessLink();

    if (!accessCode) {
      throw new InternalServerErrorException('Netki codes exhausted');
    }

    const link = `${this.businessBaseUrl}?access_code=${accessCode.code}`;

    const netkiApplication: NetkiBusinessApplicationModel = {
      id,
      link,
      address: data.address,
      accessCode: accessCode.code,
      timestamp: new Date().toISOString(),
    };

    await this.redis.setNetkiCodeToBusiness(accessCode.code, netkiApplication);

    return netkiApplication;
  }

  public async getBusinessInfo(): Promise<NetkiBusinessInfo> {
    await this.fetchAccessToken();

    const url = this.pathToUrl('business/businesses/');
    const headers = this.headers;

    const businessInfoPage = await firstValueFrom(
      this.http.get<NetkiBusinessInfoPageResponse>(url, { headers })
    );

    if (businessInfoPage.data.results.length === 0) {
      throw new Error('no business info was present');
    }

    return businessInfoPage.data.results[0];
  }

  public async fetchAccessCodes(): Promise<NetkiFetchCodesResponse> {
    const { businessId } = this;
    let url: string = this.pathToUrl(
      `business/businesses/${businessId}/access-codes/?is_active=true`
    );

    const allocatedCodes = await this.redis.getAllocatedNetkiCodes();

    let added = 0;
    while (url !== null) {
      await this.fetchAccessToken();

      const { headers } = this;

      const codeResponse = await firstValueFrom(
        this.http
          .get<NetkiAccessCodePageResponse>(url, { headers })
          .pipe(catchError((error) => this.logError(error)))
      );

      if (!codeResponse?.data.results) {
        this.logError(new Error('no results were present in fetch response'));
        throw new InternalServerErrorException();
      }

      const newLinks = codeResponse?.data?.results
        .filter(
          // filter any code that has been allocated, the presence of `parent code` implies Netki has allocated the code, for something like a user restart
          ({ code, parent_code }) =>
            !allocatedCodes.has(code) && parent_code === null
        )
        .map(({ id, code, created, is_active: isActive }: NetkiAccessCode) => ({
          id,
          code,
          created,
          isActive,
        }));

      const codesAdded = await this.redis.pushNetkiCodes(newLinks);
      added += codesAdded;

      if (codeResponse.data.next) {
        url = codeResponse.data.next;
      } else {
        break;
      }
    }

    const total = await this.redis.getAccessCodeCount();

    return { added, total };
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Polymesh CDD Onboarding/v1.0',
    };
  }

  private async fetchAccessToken(): Promise<void> {
    if (this.accessToken) {
      // don't refresh is access isn't expired
      const expiry = getExpiryFromJwt(this.accessToken);

      const oneSecondLater = new Date();
      oneSecondLater.setSeconds(oneSecondLater.getSeconds() + 1);
      if (expiry > oneSecondLater) {
        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Authorization, ...headers } = this.headers;

    const url = this.pathToUrl('token-auth/');
    const authResponse = await firstValueFrom(
      this.http
        .post(url, JSON.stringify(this.userAuth), { headers })
        .pipe(catchError((error) => this.logError(error)))
    );

    if (authResponse?.data?.access) {
      this.accessToken = authResponse.data.access;
    } else {
      const error = new Error(
        'refresh access token response did not have `access` property'
      );
      this.logError(error);

      throw error;
    }
  }

  public async queueCddJob(jobInfo: NetkiCallbackDto): Promise<void> {
    const job: CddJob = {
      type: 'netki',
      value: jobInfo,
    };

    await this.queue.add(job, bullJobOptions);
  }

  public async queueBusinessJob(
    jobInfo: NetkiBusinessCallbackDto
  ): Promise<void> {
    const job: CddJob = {
      type: 'netki-kyb',
      value: jobInfo,
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
