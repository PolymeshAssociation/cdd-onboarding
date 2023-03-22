import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import Redis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { catchError, firstValueFrom } from 'rxjs';
import { Logger } from 'winston';
import { CddJob } from '../cdd-worker/types';
import {
  allocatedCodesPrefix,
  netkiAllocatedPrefixer,
  availableCodesSetName,
  NetkiAccessCode,
  NetkiAccessCodePageResponse,
  NetkiCallbackDto,
  NetkiFetchCodesResponse,
} from './types';

@Injectable()
export class NetkiService {
  private baseUrl: string;
  private linkBaseUrl: string;
  private readonly businessId: string;
  private refreshToken: string;
  private accessToken = '';

  constructor(
    private readonly redis: Redis,
    private readonly http: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectQueue('') private readonly queue: Queue,
    config: ConfigService
  ) {
    this.refreshToken = config.getOrThrow('netki.refreshToken');
    this.businessId = config.getOrThrow('netki.businessId');
    this.baseUrl = config.getOrThrow('netki.url');
    this.linkBaseUrl = config.getOrThrow('netki.linkUrl');
  }

  public async popLink(
    address: string
  ): Promise<NetkiAccessCode & { url: string }> {
    const [rawAccessCode] = await this.redis.spop(availableCodesSetName, 1);

    if (!rawAccessCode) {
      this.logger.error('no Netki access codes found');
      throw new InternalServerErrorException();
    }

    const accessCode = JSON.parse(rawAccessCode);
    accessCode.url = `${this.linkBaseUrl}?service_code=${accessCode.code}&applicationId=${address}`;

    await this.allocateCode(accessCode.code, address);

    return accessCode;
  }

  public async fetchAccessCodes(): Promise<NetkiFetchCodesResponse> {
    await this.refreshAccessToken();

    const { businessId, headers } = this;

    const url = this.pathToUrl(
      `business/businesses/${businessId}/access-codes/?is_active=true`
    );

    const codeResponse = await firstValueFrom(
      this.http
        .get<NetkiAccessCodePageResponse>(url, { headers })
        .pipe(catchError((error) => this.logError(error)))
    );

    if (!codeResponse?.data.results) {
      this.logError(new Error('no results were present in fetch response'));
      throw new InternalServerErrorException();
    }

    const allocatedCodes = await this.getAllocatedCodes();

    const newLinks = codeResponse?.data?.results
      .filter(
        // filter any code that has been allocated, the presence of `parent code` implies Netki has allocated the code
        ({ id, parent_code }) => !allocatedCodes.has(id) && parent_code === null
      )
      .map(({ id, code, created, is_active: isActive }: NetkiAccessCode) =>
        JSON.stringify({
          id,
          code,
          created,
          isActive,
        })
      );

    const fetched = await this.redis.sadd(availableCodesSetName, newLinks);
    const total = await this.redis.scard(availableCodesSetName);

    return { fetched, total };
  }

  private async allocateCode(code: string, address: string): Promise<void> {
    this.logger.debug(`allocating access code '${code}' for '${address}'`);

    const key = netkiAllocatedPrefixer(code);
    await this.redis.set(key, address);
  }

  private async getAllocatedCodes(): Promise<Set<string>> {
    const allocatedCodes = await this.redis.keys(`${allocatedCodesPrefix}*`);

    return new Set(
      allocatedCodes.map((code) => code.replace(allocatedCodesPrefix, ''))
    );
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Polymesh CDD Onboarding/v1.0',
    };
  }

  private async refreshAccessToken() {
    // TODO base64 decode the token and expiry is written
    // TODO refresh tokens expire after 24 hours

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { Authorization, ...headers } = this.headers;

    const url = this.pathToUrl('token-refresh/');

    const data = { refresh: this.refreshToken };

    const refreshResponse = await firstValueFrom(
      this.http
        .post(url, JSON.stringify(data), { headers })
        .pipe(catchError((error) => this.logError(error)))
    );

    if (refreshResponse?.data?.access) {
      this.accessToken = refreshResponse.data.access;
    } else {
      this.logError(
        new Error(
          'refresh access token response did not have `access` property'
        )
      );
    }
  }

  public async queueCddJob(jobInfo: NetkiCallbackDto): Promise<void> {
    const job: CddJob = {
      type: 'netki',
      value: jobInfo,
    };

    await this.queue.add(job);
  }

  private async logError(error: Error) {
    this.logger.error(error.message, error.stack);
  }

  private pathToUrl(path: string): string {
    const url = new URL(path, this.baseUrl);

    return url.toString();
  }
}
