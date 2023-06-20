import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CddService } from './cdd.service';
import { CddController } from './cdd.controller';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { JumioModule } from '../jumio/jumio.module';
import { NetkiModule } from '../netki/netki.module';
import { MailchimpModule } from '../mailchimp/mailchimp.module';
import { HCaptchaGuardCredentialsProvider } from '../common/hcaptcha.guard';
import { MockCddModule } from '../mock-cdd/mock-cdd.module';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    JumioModule,
    NetkiModule,
    MockCddModule,
    MailchimpModule,
    ConfigModule,
  ],
  providers: [CddService, HCaptchaGuardCredentialsProvider],
  controllers: [CddController],
  exports: [CddService],
})
export class CddModule {}
