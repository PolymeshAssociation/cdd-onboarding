import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { API_KEY_GUARD_CREDENTIALS_PROVIDER } from '../common/api-key.guard';
import { BASIC_AUTH_CREDENTIALS_PROVIDER } from '../common/basic-auth.guard';
import { FinclusiveController } from './finclusive.controller';
import { FinclusiveService } from './finclusive.service';

@Module({
  imports: [
    AppRedisModule,
    HttpModule,
    ConfigModule,
    AppBullModule,
    BullModule.registerQueue({}),
  ],
  providers: [
    FinclusiveService,
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
  controllers: [FinclusiveController],
  exports: [FinclusiveService],
})
export class FinclusiveModule {}
