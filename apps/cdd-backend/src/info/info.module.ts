import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { PolymeshModule } from '../polymesh/polymesh.module';
import { NetkiModule } from '../netki/netki.module';
import { JumioModule } from '../jumio/jumio.module';
import { AppRedisModule } from '../app-redis/app-redis.module';
import { MailchimpModule } from '../mailchimp/mailchimp.module';

@Module({
  imports: [PolymeshModule, NetkiModule, JumioModule, AppRedisModule, MailchimpModule],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
