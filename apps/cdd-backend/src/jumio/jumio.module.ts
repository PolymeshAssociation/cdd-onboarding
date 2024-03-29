import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import { JumioController } from './jumio.controller';
import { JumioService } from './jumio.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AppBullModule,
    BullModule.registerQueue({}),
  ],
  controllers: [JumioController],
  providers: [
    JumioService,
    {
      provide: ALLOWED_IPS_PROVIDER,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<string[]>('jumio.allowedIps'),
      inject: [ConfigService],
    },
  ],
  exports: [JumioService],
})
export class JumioModule {}
