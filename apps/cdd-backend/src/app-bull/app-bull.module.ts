import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { redisEnvConfig } from '../config/redis';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(() => redisEnvConfig())],
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
