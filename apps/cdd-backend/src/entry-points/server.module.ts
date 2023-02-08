import { Module } from '@nestjs/common';

import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { CddModule } from '../cdd/cdd.module';

/**
 * Module for initializing the app in "server" mode
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CddModule,
  ],
  providers: [
    {
      // Validates all requests satisfies their respective DTO schema
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
