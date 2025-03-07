import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { redisEnvConfig } from '../config/redis';
import { AppRedisService } from './app-redis.service';

@Module({
  imports: [ConfigModule.forFeature(() => redisEnvConfig())],
  providers: [
    {
      provide: Redis,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Redis(config.getOrThrow('redis'));
      },
    },
    AppRedisService,
  ],
  exports: [AppRedisService],
})
export class AppRedisModule {}
