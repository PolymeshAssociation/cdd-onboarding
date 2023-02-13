import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppBullModule } from '../app-bull/app-bull.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { CddProcessor } from './cdd.processor';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    AppBullModule,
    BullModule.registerQueue({ name: 'cdd' }),
  ],
  providers: [CddProcessor],
})
export class CddWorkerModule {}
