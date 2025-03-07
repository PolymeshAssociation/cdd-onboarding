import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import { FinclusiveController } from './finclusive.controller';
import { FinclusiveService } from './finclusive.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AppBullModule,
    BullModule.registerQueue({}),
  ],
  providers: [
    FinclusiveService,
    {
      provide: ALLOWED_IPS_PROVIDER,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<string[]>('finclusive.allowedIps'),
      inject: [ConfigService],
    },
  ],
  controllers: [FinclusiveController],
  exports: [FinclusiveService],
})
export class FinclusiveModule {}
