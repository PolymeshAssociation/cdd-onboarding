import { CddProvider } from '@cdd-onboarding/cdd-types';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';
import { netkiAllocatedPrefixer, NetkiCallbackDto } from '../netki/types';
import { CddJob, JumioCddJob, NetkiCddJob } from './types';

@Processor()
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly redis: Redis,
    private readonly logger: Logger
  ) {}

  @Process()
  async generateCdd(job: Job<CddJob>) {
    if (job.data.type === 'jumio') {
      await this.handleJumio(job.data);
    } else if (job.data.type === 'netki') {
      await this.handleNetki(job.data);
    } else {
      this.logger.error('unknown CDD job type encountered');
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

    const key = netkiAllocatedPrefixer(jobId);
    const address = await this.redis.get(key);

    if (!address) {
      const error = new Error(`Netki record not found for '${key}'`);
      this.logError(jobId, provider, 'could not find netki record', error);
      throw error;
    }

    this.log(jobId, provider, `retrieved address: '${address}'`);

    if (state === 'restarted') {
      await this.handleNetkiRestart(jobId, provider, address, netki);
    } else if (state === 'completed') {
      await this.createCddClaim(jobId, provider, address);

      await this.clearAddressApplications(jobId, provider, address);
    } else {
      this.log(
        jobId,
        provider,
        `hook state: '${state}' not handled - no action taken`
      );
    }

    this.logDone(jobId, provider, 'completed successfully');

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
      const error = new Error('child_codes not found in restart webhook');
      this.logError(jobId, provider, 'new access code not found', error);
      throw error;
    }

    const newKey = netkiAllocatedPrefixer(childCode.code);

    this.log(jobId, provider, `allocating code '${newKey}' for '${address}'`);
    await this.redis.set(newKey, address);
  }

  private async handleJumio({ value: jumio }: JumioCddJob): Promise<void> {
    const { customerId: address, jumioIdScanReference: jobId } = jumio;
    const provider = 'jumio';

    this.logStart(jobId, provider);
    this.log(jobId, provider, `attempting to create cdd for '${address}'`);

    if (jumio.verificationStatus !== 'APPROVED_VERIFIED') {
      this.logDone(
        jobId,
        provider,
        `Jumio verification status: '${jumio.verificationStatus}' was not equal to 'APPROVED_VERIFIED' - no action taken`
      );

      return;
    }

    await this.createCddClaim(jobId, provider, address);

    await this.clearAddressApplications(jobId, provider, address);

    this.logDone(jobId, provider, 'completed successfully');
  }

  private async clearAddressApplications(
    jobId: string,
    provider: CddProvider,
    address: string
  ): Promise<number | void> {
    this.log(jobId, provider, `clearing application records for: '${address}'`);
    return this.redis.del(address).catch((error) => {
      this.logError(jobId, provider, 'could not remove address records', error);

      return; //  swallow the error - the CDD claim was already made
    });
  }

  private async createCddClaim(
    jobId: string,
    provider: CddProvider,
    address: string
  ): Promise<void> {
    this.log(jobId, provider, 'creating cdd');

    const registerIdentityTx = await this.polymesh.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    const createdIdentity = await registerIdentityTx.run().catch((error) => {
      this.logError(jobId, provider, 'could not create cdd claim', error);

      throw error;
    });

    this.log(
      jobId,
      provider,
      `created CDD claim for DID: '${createdIdentity.did}' with '${address}' as the primary account`
    );
  }

  private logStart(jobId: string, provider: CddProvider) {
    this.logger.log(
      JSON.stringify({
        jobId,
        provider,
        message: `[START] Job: ${provider}-${jobId}`,
      })
    );
  }

  private log(jobId: string, provider: CddProvider, info: string) {
    this.logger.log(
      JSON.stringify({
        jobId,
        provider,
        message: `[INFO] Job: ${provider}-${jobId} - ${info}`,
      })
    );
  }

  private logError(
    jobId: string,
    provider: CddProvider,
    info: string,
    error: Error
  ) {
    this.logger.error(
      JSON.stringify({
        jobId,
        provider,
        message: `[ERROR] Job: ${provider}-${jobId} - ${info} - ${error.message}`,
      }),
      error.stack
    );
  }

  private logDone(jobId: string, provider: CddProvider, info: string) {
    this.logger.log(
      JSON.stringify({
        jobId,
        provider,
        message: `[DONE] Job: ${provider}-${jobId} - ${info}`,
      })
    );
  }
}
