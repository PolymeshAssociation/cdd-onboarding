import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';
import Redis from 'ioredis';

@Processor('cdd')
export class CddProcessor {
  constructor(
    private readonly polymesh: Polymesh,
    private readonly logger: Logger,
    private readonly redis: Redis
  ) {}

  @Process('cdd')
  async generateCdd(job: Job) {
    const { id, address } = job.data;

    this.logger.log('processing CDD job', { id, address });

    const registerIdentityTx = await this.polymesh.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    await registerIdentityTx.run().catch((error) => {
      this.logger.error(
        `could not create cdd claim for ${address}: ${error.message}`,
        error.stack
      );

      throw error;
    });

    await this.redis.del(address).catch((error) => {
      this.logger.error(
        `could not remove previous links for ${address}`,
        error.stack
      );

      throw error; //  it might be better to swallow the error - the CDD claim was already made
    });
  }
}
