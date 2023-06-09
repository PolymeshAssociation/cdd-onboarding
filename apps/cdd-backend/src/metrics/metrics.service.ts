import { NetkiCodeCountResponse } from '@cdd-onboarding/cdd-types';
import { Injectable } from '@nestjs/common';
import { AppRedisService } from '../app-redis/app-redis.service';

@Injectable()
export class MetricsService {
  constructor(private readonly redis: AppRedisService) {}

  public async getNetkiAvailableCodeCount(): Promise<NetkiCodeCountResponse> {
    const count = await this.redis.availableNetkiCodeCount();

    return { count };
  }
}
