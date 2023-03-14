import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { NetkiService } from './netki.service';
import { NetkiController } from './netki.controller';
import { ConfigModule } from '@nestjs/config';
import { AppBullModule } from '../app-bull/app-bull.module';
import { BullModule } from '@nestjs/bull';

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
    { provide: Logger, useValue: new Logger(NetkiModule.name) },
  ],
  controllers: [NetkiController],
  exports: [NetkiService],
})
export class NetkiModule {}
