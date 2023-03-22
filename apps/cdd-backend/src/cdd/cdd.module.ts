import { Module } from '@nestjs/common';
import { CddService } from './cdd.service';
import { CddController } from './cdd.controller';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { JumioModule } from '../jumio/jumio.module';
import { NetkiModule } from '../netki/netki.module';

@Module({
  imports: [PolymeshModule, AppRedisModule, JumioModule, NetkiModule],
  providers: [CddService],
  controllers: [CddController],
  exports: [CddService],
})
export class CddModule {}
