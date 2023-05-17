import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { netkiAllocatedPrefixer, NetkiCallbackDto } from '../netki/types';
import { CddJob, JobIdentifier, JumioCddJob, NetkiCddJob } from './types';

@Processor()
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly redis: Redis,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Process()
  async generateCdd(job: Job<CddJob>) {
    try {
      if (job.data.type === 'jumio') {
        await this.handleJumio(job.data);
      } else if (job.data.type === 'netki') {
        await this.handleNetki(job.data);
      } else {
        throw new Error('unknown Cdd job type encountered');
      }
    } catch (error) {
      this.logger.error('problem processing cdd job', {
        data: job.data,
        error,
      });
    }
  }

  private async handleNetki({ value: netki }: NetkiCddJob): Promise<void> {
    const {
      identity: {
        transaction_identity: { client_guid: id },
        state,
      },
    } = netki;
    const jobId: JobIdentifier = { id, provider: 'netki' };

    this.logger.info('starting netki job', { jobId });

    const netkiAccessCodeKey = netkiAllocatedPrefixer(id);
    const address = await this.redis.get(netkiAccessCodeKey);

    if (!address) {
      throw new Error(`Netki record not found`);
    }

    this.logger.info('retrieved address', { jobId, address });

    if (state === 'restarted') {
      await this.handleNetkiRestart(jobId, address, netki);
    } else if (state === 'completed') {
      await this.createCddClaim(jobId, address);

      await this.clearAddressApplications(jobId, address);
    } else {
      this.logger.info('state did not have a handler - no action taken', {
        jobId,
        address,
        state,
      });
    }

    this.logger.info('Netki CDD job completed successfully', {
      jobId: jobId,
    });
  }

  private async handleNetkiRestart(
    jobId: JobIdentifier,
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
      throw new Error(
        'property `child_codes` was not found in restart webhook payload'
      );
    }

    const newCodeKey = netkiAllocatedPrefixer(childCode.code);

    this.logger.info('allocating restart access code', {
      jobId,
      address,
      childCode,
    });

    await this.redis.set(newCodeKey, address);
  }

  private async handleJumio({ value: jumio }: JumioCddJob): Promise<void> {
    const {
      customerId: address,
      jumioIdScanReference: id,
      verificationStatus: status,
    } = jumio;
    const jobId: JobIdentifier = { id, provider: 'jumio' };

    this.logger.info('starting jumio CDD job', { jobId });

    if (status === 'APPROVED_VERIFIED') {
      await this.createCddClaim(jobId, address);

      await this.clearAddressApplications(jobId, address);
    } else {
      this.logger.info(
        'Jumio verification status was not equal to `APPROVED_VERIFIED` - no action taken',
        { jobId, status: jumio.verificationStatus }
      );
    }

    this.logger.info('completed jumio CDD job successfully', { jobId });
  }

  private async clearAddressApplications(
    jobId: JobIdentifier,
    address: string
  ): Promise<number | void> {
    this.logger.info('clearing CDD application records', { jobId, address });

    return this.redis.del(address).catch((error) => {
      this.logger.error('problem clearing address CDD applications', {
        jobId,
        address,
        error,
      });
      // Swallow the error. The job was processed and shouldn't be retried
    });
  }

  private async createCddClaim(
    jobId: JobIdentifier,
    address: string
  ): Promise<void> {
    this.logger.info('attempting CDD creation', { jobId, address });

    const registerIdentityTx = await this.polymesh.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    const createdIdentity = await registerIdentityTx.run();

    this.logger.info('created CDD claim', {
      jobId,
      address,
      did: createdIdentity.did,
    });
  }
}
