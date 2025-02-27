import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppRedisModule } from '../app-redis/app-redis.module';
import { HCaptchaGuardCredentialsProvider } from '../common/hcaptcha.guard';
import { FinclusiveModule } from '../finclusive/finclusive.module';
import { JumioModule } from '../jumio/jumio.module';
import { MailchimpModule } from '../mailchimp/mailchimp.module';
import { MockCddModule } from '../mock-cdd/mock-cdd.module';
import { NetkiModule } from '../netki/netki.module';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { CddController } from './cdd.controller';
import { CddService } from './cdd.service';

@Module({
  imports: [
    PolymeshModule,
    AppRedisModule,
    JumioModule,
    NetkiModule,
    FinclusiveModule,
    MockCddModule,
    MailchimpModule,
    ConfigModule,
  ],
  providers: [CddService, HCaptchaGuardCredentialsProvider],
  controllers: [CddController],
  exports: [CddService],
})
export class CddModule {}
