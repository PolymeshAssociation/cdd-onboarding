import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { NetkiService } from './netki.service';
import { NetkiController } from './netki.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { BullModule } from '@nestjs/bull';
import { BASIC_AUTH_CREDENTIALS_PROVIDER } from '../common/basic-auth.guard';
import { API_KEY_GUARD_CREDENTIALS_PROVIDER } from '../common/api-key.guard';

@Module({
  imports: [
    AppRedisModule,
    HttpModule,
    ConfigModule,
    AppBullModule,
    BullModule.registerQueue({}),
  ],
  providers: [
    NetkiService,
    {
      provide: BASIC_AUTH_CREDENTIALS_PROVIDER,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<string[]>('netki.allowedBasicAuth'),
      inject: [ConfigService],
    },
    {
      provide: API_KEY_GUARD_CREDENTIALS_PROVIDER,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<string[]>('netki.allowedApiKeys'),
      inject: [ConfigService],
    },
  ],
  controllers: [NetkiController],
  exports: [NetkiService],
})
export class NetkiModule {}
