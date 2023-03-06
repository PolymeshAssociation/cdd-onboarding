import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';
import { BullModule, BullModuleOptions } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [config],
        }),
      ],
      useFactory: async (
        configService: ConfigService
      ): Promise<BullModuleOptions> => ({
        redis: configService.getOrThrow('redis'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppBullModule {}
