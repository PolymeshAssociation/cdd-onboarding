import { Process, Processor } from '@nestjs/bull';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { Job } from 'bull';

@Processor('cdd')
export class CddProcessor {
  constructor(private readonly sdk: Polymesh) {}

  @Process('cdd')
  async generateCdd(job: Job) {
    const { id, address } = job.data;

    console.log('processing CDD job', { id, address });

    const registerId = await this.sdk.identities.registerIdentity({
      targetAccount: address,
      createCdd: true,
    });

    registerId.run();
  }
}
