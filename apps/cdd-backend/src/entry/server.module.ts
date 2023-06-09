import { Module } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigModule } from '@nestjs/config';
import { CddModule } from '../cdd/cdd.module';
import { WinstonModule } from 'nest-winston';
import { serverEnvConfig } from '../config/server';
import { loggerEnvConfig } from '../config/logger';
import { InfoModule } from '../info/info.module';
import { HealthModule } from '../health/health.module';
import { MetricsModule } from '../metrics/metrics.module';

/**
 * Module for initializing the app in "server" mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverEnvConfig],
    }),
    WinstonModule.forRoot(loggerEnvConfig(ServerModule.name)),
    CddModule,
    InfoModule,
    HealthModule,
    MetricsModule,
  ],
  providers: [
    {
      // Ensure all requests satisfy their respective DTO schema
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class ServerModule {}
