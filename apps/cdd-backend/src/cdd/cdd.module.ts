import { Module } from '@nestjs/common';
import { CddService } from './cdd.service';
import { CddController } from './cdd.controller';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { AppBullModule } from '../app-bull-module.ts/app-bull-module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PolymeshModule,
    AppBullModule,
    BullModule.registerQueue({ name: 'cdd' }),
  ],
  providers: [CddService],
  controllers: [CddController],
  exports: [CddService],
})
export class CddModule {}
