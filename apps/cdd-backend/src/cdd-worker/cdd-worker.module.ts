import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { AppBullModule } from '../app-bull/app-bull.module';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { CddProcessor } from './cdd.processor';
// import { Logger } from 'winston';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    AppBullModule,
    BullModule.registerQueue({}),
  ],
  providers: [CddProcessor],
})
export class CddWorkerModule {}
