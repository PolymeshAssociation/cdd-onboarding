import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: Polymesh,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return Polymesh.connect({
          nodeUrl: configService.getOrThrow('polymeshSdk.nodeUrl'),
        });
      },
    },
  ],
})
export class AppModule {}
