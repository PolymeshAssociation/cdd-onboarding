import { CddProvider } from '@cdd-onboarding/cdd-types';
import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { netkiAllocatedPrefixer, NetkiCallbackDto } from '../netki/types';
import { CddJob, JumioCddJob, NetkiCddJob } from './types';

@Processor()
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly redis: Redis,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Process()
  async generateCdd(job: Job<CddJob>) {
    if (job.data.type === 'jumio') {
      await this.handleJumio(job.data);
    } else if (job.data.type === 'netki') {
      await this.handleNetki(job.data);
    } else {
      const error = new Error('unknown Cdd job type encountered');
      this.recordError('???', '???' as CddProvider, error, job.data);
    }
  }

  private async handleNetki({ value: netki }: NetkiCddJob): Promise<void> {
    const {
      identity: {
        transaction_identity: { client_guid: jobId },
        state,
      },
    } = netki;
    const provider = 'netki';

    this.logStart(jobId, provider);

    const netkiAccessCodeKey = netkiAllocatedPrefixer(jobId);
    const address = await this.redis.get(netkiAccessCodeKey);

    if (!address) {
      const error = new Error(`Netki record not found`);
      this.recordError(jobId, provider, error, { netkiAccessCodeKey });
    }

    this.logInfo(jobId, provider, 'retrieved address', { address });

    if (state === 'restarted') {
      await this.handleNetkiRestart(jobId, provider, address, netki);
    } else if (state === 'completed') {
      await this.createCddClaim(jobId, provider, address);

      await this.clearAddressApplications(jobId, provider, address);
    } else {
      this.logInfo(
        jobId,
        provider,
        'state did not have a handler - no action taken',
        { state }
      );
    }

    this.logDone(jobId, provider);

    return;
  }

  private async handleNetkiRestart(
    jobId: string,
    provider: CddProvider,
    address: string,
    netki: NetkiCallbackDto
  ): Promise<void> {
    const {
      identity: {
        transaction_identity: {
          identity_access_code: { child_codes: childCodes },
        },
      },
    } = netki;

    const childCode = childCodes[0];

    if (!childCode) {
      const error = new Error(
        'property `child_codes` was not found in restart webhook payload'
      );
      this.recordError(jobId, provider, error, { address });
    }

    const newCodeKey = netkiAllocatedPrefixer(childCode.code);

    this.logInfo(jobId, provider, 'allocating restart access code', {
      address,
      accessCode: childCode.code,
    });

    await this.redis.set(newCodeKey, address);
  }

  private async handleJumio({ value: jumio }: JumioCddJob): Promise<void> {
    const { customerId: address, jumioIdScanReference: jobId } = jumio;
    const provider = 'jumio';

    this.logStart(jobId, provider);

    if (jumio.verificationStatus === 'APPROVED_VERIFIED') {
      await this.createCddClaim(jobId, provider, address);

      await this.clearAddressApplications(jobId, provider, address);
    } else {
      this.logInfo(
        jobId,
        provider,
        'Jumio verification status was not equal to `APPROVED_VERIFIED` - no action taken',
        { status: jumio.verificationStatus }
      );
    }

    this.logDone(jobId, provider);
  }

  private async clearAddressApplications(
    jobId: string,
    provider: CddProvider,
    address: string
  ): Promise<number | void> {
    this.logInfo(jobId, provider, 'clearing application records', { address });

    return this.redis.del(address).catch((error) => {
      this.recordError(jobId, provider, error, {
        address,
      });
    });
  }

  private async createCddClaim(
    jobId: string,
    provider: CddProvider,
    address: string
  ): Promise<void> {
    this.logInfo(jobId, provider, 'attempting to create CDD claim', {
      address,
    });

    const registerIdentityTx = await this.polymesh.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    const createdIdentity = await registerIdentityTx.run().catch((error) => {
      this.recordError(jobId, provider, error, { address });
    });

    this.logInfo(jobId, provider, 'created CDD claim', {
      did: createdIdentity.did,
      address,
    });
  }

  private logStart(jobId: string, provider: CddProvider) {
    this.logger.info('START', {
      jobId,
      provider,
    });
  }

  private logInfo(
    jobId: string,
    provider: CddProvider,
    message: string,
    data: Record<string, unknown>
  ) {
    this.logger.info(message, {
      jobId,
      provider,
      data,
    });
  }

  private recordError(
    jobId: string,
    provider: CddProvider,
    error: Error,
    data: Record<string, unknown>
  ): never {
    const { message, ...errorInfo } = error;
    this.logger.error(message, { error: errorInfo, data, jobId, provider });

    throw error;
  }

  private logDone(jobId: string, provider: CddProvider) {
    this.logger.info('DONE', {
      jobId,
      provider,
    });
  }
}
