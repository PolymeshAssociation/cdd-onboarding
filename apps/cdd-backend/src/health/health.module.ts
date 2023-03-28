import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import { InfoModule } from '../info/info.module';
import { HealthController } from './health.controller';

@Module({
  imports: [InfoModule, ConfigModule],
  providers: [
    {
      provide: ALLOWED_IPS_PROVIDER,
      useFactory: (config: ConfigService) =>
        config.getOrThrow<string[]>('server.healthAllowedIps'),
      inject: [ConfigService],
    },
  ],
  controllers: [HealthController],
})
export class HealthModule {}
