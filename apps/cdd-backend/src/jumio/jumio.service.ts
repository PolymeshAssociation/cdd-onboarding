import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Queue } from 'bull';
import { firstValueFrom } from 'rxjs';
import { CddJob } from '../cdd-worker/types';
import { JumioCallbackDto } from './types';

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
    private readonly logger: Logger
  ) {}

  /**
   * @note - docs: https://github.com/Jumio/implementation-guides/blob/master/netverify/netverify-web-v4.md#initiating-a-id-verification-transaction
   */
  public async generateLink(
    transactionId: string,
    address: string
  ): Promise<Record<string, unknown>> {
    const headers = {
      ...this.baseHeaders,
      Authorization: `Basic ${this.config.getOrThrow('jumio.apiKey')}`,
    };

    const url = this.config.getOrThrow('jumio.generateLinkUrl');

    const response = (await firstValueFrom(
      this.http.post(
        url,
        JSON.stringify({
          customerInternalReference: transactionId,
          userReference: address,
        }),
        { headers }
      )
    ).catch((error) => {
      this.logger.error(
        `could not generate link: ${error.message}`,
        error.stack
      );

      throw new InternalServerErrorException();
    })) as AxiosResponse;

    if (response.status !== HttpStatus.OK) {
      this.logger.error(
        `received non 200 response when generating an onboarding link code: ${response.status}`
      );

      throw new InternalServerErrorException();
    }

    return response.data;
  }

  public async queueApplication(request: JumioCallbackDto): Promise<void> {
    const job: CddJob = {
      address: request.customerId,
      externalId: request.jumioIdScanReference,
      jumio: request,
    };

    // maybe save the raw request to redis for audit purposes?
    await this.queue.add(job);
  }
}
