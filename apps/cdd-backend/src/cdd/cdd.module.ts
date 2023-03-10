import { Logger, Module } from '@nestjs/common';
import { CddService } from './cdd.service';
import { CddController } from './cdd.controller';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { JumioModule } from '../jumio/jumio.module';
import { NetkiModule } from '../netki/netki.module';
import { ConfigModule } from '@nestjs/config';
import { redisEnvConfig } from '../config/redis';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    JumioModule,
    NetkiModule,
    ConfigModule.forFeature(() => redisEnvConfig()),
  ],
  providers: [
    CddService,
    { provide: Logger, useValue: new Logger(CddModule.name) },
  ],
  controllers: [CddController],
  exports: [CddService],
})
export class CddModule {}
