import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { CddJob } from '../cdd-worker/types';
import { MockCddDto } from './types';

@Injectable()
export class MockCddService {
  constructor(@InjectQueue('') private readonly queue: Queue) {}

  public async queueMockCddJob(jobInfo: MockCddDto): Promise<void> {
    const job: CddJob = {
      type: 'mock',
      value: jobInfo,
    };

    await this.queue.add(job);
  }
}
