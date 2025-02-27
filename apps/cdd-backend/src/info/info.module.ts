import { Module } from '@nestjs/common';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { FinclusiveModule } from '../finclusive/finclusive.module';
import { JumioModule } from '../jumio/jumio.module';
import { MailchimpModule } from '../mailchimp/mailchimp.module';
import { NetkiModule } from '../netki/netki.module';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  imports: [
    PolymeshModule,
    NetkiModule,
    JumioModule,
    FinclusiveModule,
    AppRedisModule,
    MailchimpModule,
  ],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
