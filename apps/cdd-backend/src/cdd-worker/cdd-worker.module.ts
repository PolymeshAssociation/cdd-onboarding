import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppBullModule } from '../app-bull-module.ts/app-bull-module';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { CddProcessor } from './cdd.processor';

@Module({
  imports: [
    PolymeshModule,
    AppBullModule,
    BullModule.registerQueue({ name: 'cdd' }),
  ],
  providers: [CddProcessor],
})
export class CddWorkerModule {}
