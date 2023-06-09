import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [AppRedisModule, ConfigModule],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    {
      provide: ALLOWED_IPS_PROVIDER,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<string[]>('server.metricsAllowedIps'),
      inject: [ConfigService],
    },
  ],
})
export class MetricsModule {}
