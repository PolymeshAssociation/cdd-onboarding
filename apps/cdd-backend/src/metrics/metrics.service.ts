import {
  JobQueueStatsResponse,
  NetkiCodeCountResponse,
} from '@cdd-onboarding/cdd-types';
import { Injectable } from '@nestjs/common';
import { AppRedisService } from '../app-redis/app-redis.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MetricsService {
  constructor(
    private readonly redis: AppRedisService,
    @InjectQueue('') private readonly queue: Queue
  ) {}

  public async getNetkiAvailableCodeCount(): Promise<NetkiCodeCountResponse> {
    const count = await this.redis.availableNetkiCodeCount();

    return { count };
  }

  public async getJobQueueStats(): Promise<JobQueueStatsResponse> {
    const [active, completed, failed, waiting, [oldestJob]] = await Promise.all(
      [
        this.queue.getActiveCount(),
        this.queue.getCompletedCount(),
        this.queue.getFailedCount(),
        this.queue.getWaitingCount(),
        this.queue.getWaiting(0, 0),
      ]
    );

    let oldestSeconds = 0;
    if (oldestJob) {
      oldestSeconds = Math.floor((Date.now() - oldestJob.timestamp) / 1000);
    }

    return {
      active,
      completed,
      failed,
      waiting,
      oldestSeconds,
    };
  }
}
