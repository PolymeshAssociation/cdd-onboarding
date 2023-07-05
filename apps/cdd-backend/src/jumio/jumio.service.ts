import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { firstValueFrom } from 'rxjs';
import { Logger } from 'winston';
import { CddJob } from '../cdd-worker/types';
import { JumioCallbackDto, JumioGenerateLinkResponse } from './types';

@Injectable()
export class JumioService {
  private readonly baseHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'Polymesh CDD Onboarding/v1.0',
  };

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectQueue('') private readonly queue: Queue,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  /**
   * @note - docs: https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#initiating-a-id-verification-transaction
   */
  public async generateLink(
    address: string
  ): Promise<JumioGenerateLinkResponse> {
    this.logger.debug('generating jumio onboarding link', {
      address,
    });

    const headers = {
      ...this.baseHeaders,
      Authorization: `Basic ${this.config.getOrThrow('jumio.apiKey')}`,
    };

    const url = this.config.getOrThrow('jumio.generateLinkUrl');

    const response = (await firstValueFrom(
      this.http.post(
        url,
        JSON.stringify({
          customerInternalReference: address,
          userReference: address,
        }),
        { headers }
      )
    ).catch((error) => {
      this.logger.error(
        'could not fetch jumio onboarding link',
        { address, error: error.message },
        error.stack
      );

      throw new InternalServerErrorException();
    })) as AxiosResponse;

    if (response.status !== HttpStatus.OK) {
      this.logger.error('jumio onboarding link response had non 200 code', {
        responseCode: response.status,
      });

      throw new InternalServerErrorException();
    }

    return response.data;
  }

  public async queueApplication(request: JumioCallbackDto): Promise<void> {
    const job: CddJob = {
      type: 'jumio',
      value: request,
    };

    await this.queue.add(job);
  }
}
