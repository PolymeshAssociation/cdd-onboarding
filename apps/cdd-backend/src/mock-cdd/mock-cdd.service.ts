import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CddJob, ProviderEnum } from '../cdd-worker/types';
import { MockCddDto } from './types';
import { bullJobOptions } from '../config/consts';

@Injectable()
export class MockCddService {
  constructor(@InjectQueue('') private readonly queue: Queue) {}

  public async queueMockCddJob(jobInfo: MockCddDto): Promise<void> {
    const job: CddJob = {
      type: ProviderEnum.MOCK,
      value: jobInfo,
    };

    await this.queue.add(job, bullJobOptions);
  }
}
