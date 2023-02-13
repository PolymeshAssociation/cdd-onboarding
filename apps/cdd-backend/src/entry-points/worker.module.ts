import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { CddWorkerModule } from '../cdd-worker/cdd-worker.module';

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
