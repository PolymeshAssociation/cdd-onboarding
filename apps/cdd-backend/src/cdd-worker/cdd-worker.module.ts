import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { AppBullModule } from '../app-bull/app-bull.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { CddProcessor } from './cdd.processor';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    AppBullModule,
    BullModule.registerQueue({}),
  ],
  providers: [
    CddProcessor,
    { provide: Logger, useValue: new Logger(CddWorkerModule.name) },
  ],
})
export class CddWorkerModule {}
