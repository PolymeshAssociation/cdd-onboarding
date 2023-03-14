import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import { loggerEnvConfig } from '../config/logger';
import { startTelemetry } from '../config/telemetry';

import { WorkerModule } from './worker.module';

/**
 * start a worker process
 */
async function bootstrap() {
  const logger = createLogger(loggerEnvConfig('CddWorker'));
  startTelemetry(logger);

  await NestFactory.createApplicationContext(WorkerModule, {
    logger: WinstonModule.createLogger({ instance: logger }),
  });

  logger.info('🐂 Worker process has started up');
}

bootstrap();
