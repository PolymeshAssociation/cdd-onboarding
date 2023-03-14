import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { WorkerModule } from './entry-points/worker.module';

import { openTelemetrySdk, setTelemetryServiceName } from './telemetry';

async function bootstrap() {
  if (openTelemetrySdk) {
    setTelemetryServiceName('CddWorker');
    await openTelemetrySdk.start();
  }

  await NestFactory.createApplicationContext(WorkerModule);

  Logger.log('🐂 Worker process has started up');
}

bootstrap();
