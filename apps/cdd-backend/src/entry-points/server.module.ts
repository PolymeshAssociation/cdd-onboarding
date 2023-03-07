import { Module } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigModule } from '@nestjs/config';
import config from '../config/server';
import { CddModule } from '../cdd/cdd.module';
import { NetkiModule } from '../netki/netki.module';

/**
 * Module for initializing the app in "server" mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
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
