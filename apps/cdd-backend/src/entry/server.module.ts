import { Module } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigModule } from '@nestjs/config';
import { CddModule } from '../cdd/cdd.module';
import { NetkiModule } from '../netki/netki.module';
import { WinstonModule } from 'nest-winston';
import { serverEnvConfig } from '../config/server';
import { loggerConfig } from '../config/logger';

/**
 * Module for initializing the app in "server" mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverEnvConfig],
    }),
    WinstonModule.forRoot(loggerConfig.console()),
    CddModule,
    NetkiModule,
  ],
  providers: [
    {
      // Validates all requests satisfies their respective DTO schema
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class ServerModule {}
