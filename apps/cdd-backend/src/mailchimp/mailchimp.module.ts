import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { mailchimpEnvConfig } from '../config/mailchimp';
import { MailchimpService } from './mailchimp.service';
import { MailchimpProvider } from './mailchimp.provider';

@Module({
  imports: [ConfigModule.forFeature(() => mailchimpEnvConfig())],
  providers: [MailchimpService, MailchimpProvider],
  exports: [MailchimpService],
})
export class MailchimpModule {}
