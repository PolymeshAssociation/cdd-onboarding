import { Provider } from '@nestjs/common';
import client from '@mailchimp/mailchimp_marketing';

export const MailchimpProvider: Provider = {
  provide: 'MAILCHIMP_CLIENT',
  useValue: client,
};