import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { loggerEnvConfig } from '../config/logger';
import { workerEnvConfig } from '../config/worker';
import { CddWorkerModule } from '../cdd-worker/cdd-worker.module';
import { WinstonModule } from 'nest-winston';

/**
 * Module for initializing the app in "worker" mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [workerEnvConfig],
    }),
    WinstonModule.forRoot(loggerEnvConfig(WorkerModule.name)),
    CddWorkerModule,
  ],
})
export class WorkerModule {}
