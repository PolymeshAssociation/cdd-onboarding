import { Module } from '@nestjs/common';
import { MailchimpService } from './mailchimp.service';
import { ConfigModule } from '@nestjs/config';
import { mailchimpEnvConfig } from '../config/mailchimp';

@Module({
    imports: [ConfigModule.forFeature(() => mailchimpEnvConfig())],
  providers: [
    MailchimpService,
  ],
  exports: [MailchimpService],
})
export class MailchimpModule {}
