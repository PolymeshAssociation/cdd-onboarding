import { Provider } from '@nestjs/common';
import client from '@mailchimp/mailchimp_marketing';

export const MAILCHIMP_CLIENT_PROVIDER = Symbol(
  'MAILCHIMP_CLIENT'
);

export const MailchimpProvider: Provider = {
  provide: MAILCHIMP_CLIENT_PROVIDER,
  useValue: client,
};