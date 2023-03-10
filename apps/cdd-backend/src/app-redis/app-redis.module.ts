import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { redisEnvConfig } from '../config/redis';

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
  ],
  exports: [Redis],
})
export class AppRedisModule {}
