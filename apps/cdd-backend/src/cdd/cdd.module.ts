import { Module } from '@nestjs/common';
import { CddService } from './cdd.service';
import { CddController } from './cdd.controller';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { BullModule } from '@nestjs/bull';
import { AppBullModule } from '../app-bull/app-bull.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { JumioModule } from '../jumio/jumio.module';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    AppBullModule,
    BullModule.registerQueue({ name: 'cdd' }),
    JumioModule,
  ],
  providers: [CddService],
  controllers: [CddController],
  exports: [CddService],
})
export class CddModule {}
