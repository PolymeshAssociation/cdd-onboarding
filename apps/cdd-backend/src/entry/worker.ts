import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { loggerEnvConfig } from '../config/logger';
import { openTelemetrySdk, setTelemetryServiceName } from '../config/telemetry';

import { WorkerModule } from './worker.module';

/**
 * Bootstrap a background worker
 */
async function bootstrap() {
  const logger = createLogger(loggerEnvConfig('CddWorker'));
  if (openTelemetrySdk) {
    setTelemetryServiceName('CddWorker');
    await openTelemetrySdk.start();
  }

  await NestFactory.createApplicationContext(WorkerModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  logger.info('🐂 Worker process has started up');
}

bootstrap();
