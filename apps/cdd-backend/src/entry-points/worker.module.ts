import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { CddWorkerModule } from '../cdd-worker/cdd-worker.module';
import { AppRedisModule } from '../app-redis/app-redis.module';

/**
 * Module for initializing the app in "worker" mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CddWorkerModule,
  ],
})
export class WorkerModule {}
