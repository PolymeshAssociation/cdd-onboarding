import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';
import { CddJob } from './types';

@Processor()
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly redis: Redis,
    private readonly logger: Logger
  ) {}

  @Process()
  async generateCdd(job: Job<CddJob>) {
    const { address, externalId, jumio } = job.data;

    this.logger.log(
      `[START] job: ${externalId} for address: ${address} - Provider: jumio`
    );

    if (jumio.verificationStatus !== 'APPROVED_VERIFIED') {
      this.logger.log(
        `[DONE] job: ${externalId} jumio status ${jumio.verificationStatus} was not equal to "APPROVED_VERIFIED", no action taken`
      );
      return;
    }

    const registerIdentityTx = await this.polymesh.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    const createdIdentity = await registerIdentityTx.run().catch((error) => {
      this.logger.error(
        `[ERROR] job: ${externalId} could not create cdd claim for ${address} Error: ${error.message}`,
        error.stack
      );

      throw error;
    });

    this.logger.log(
      `[INFO] Job: ${externalId} created Identity ${createdIdentity.did} with ${address} as its primary key`
    );

    await this.redis.del(address).catch((error) => {
      this.logger.error(
        `[ERROR] could not remove applications for ${address} after processing ${externalId}`,
        error.stack
      );

      return; //  swallow the error - the CDD claim was already made
    });

    this.logger.log(`[DONE] Job: ${externalId} processed successfully`);
  }
}
