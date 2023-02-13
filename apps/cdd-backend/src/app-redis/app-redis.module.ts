import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
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
