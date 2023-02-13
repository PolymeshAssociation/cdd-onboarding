import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';

@Processor('cdd')
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly redis: Redis,
    private readonly logger: Logger
  ) {}

  @Process('cdd')
  async generateCdd(job: Job) {
    const { id, address } = job.data;

    this.logger.log(`[START] Job ${id} for address: ${address}`);

    const registerIdentityTx = await this.polymesh.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    await registerIdentityTx.run().catch((error) => {
      this.logger.error(
        `[ERROR] Job ${id} could not create cdd claim for ${address}: ${error.message}`,
        error.stack
      );

      throw error;
    });

    await this.redis.del(address).catch((error) => {
      this.logger.error(
        `[ERROR] Job ${id} could not remove previous links for ${address}`,
        error.stack
      );

      throw error; //  it might be better to swallow the error - the CDD claim was already made
    });

    this.logger.log(`[DONE] Job: ${id} processed successfully`);
  }
}
