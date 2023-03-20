import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { NetkiService } from './netki.service';
import { NetkiController } from './netki.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { BullModule } from '@nestjs/bull';
import { ALLOWED_IPS_TOKEN } from '../common/ip-filter.guard';

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
      provide: ALLOWED_IPS_TOKEN,
      useFactory: (config: ConfigService) =>
        config.getOrThrow('netki.allowedIps'),
      inject: [ConfigService],
    },
  ],
  controllers: [NetkiController],
  exports: [NetkiService],
})
export class NetkiModule {}
