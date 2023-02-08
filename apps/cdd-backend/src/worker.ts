import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { WorkerModule } from './entry-points/worker.module';

/**
 * Bootstrap a background worker
 */
async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerModule);

  Logger.log('🐂 Worker process has started up');
}

bootstrap();
