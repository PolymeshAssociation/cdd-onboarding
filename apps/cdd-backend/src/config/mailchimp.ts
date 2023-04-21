import { z } from 'zod';

const mailchimpZ = z
  .object({
    mailchimp: z.object({
      apiKey: z.string().describe('mailchimp api key'),
      serverPrefix: z.string().describe('mailchimp server prefix'),
      isEnabled: z.coerce
        .boolean()
        .optional()
        .describe('mailchimp capture email enabled'),
      listId: z.string().describe('mailchimp list id'),
    }),
  })
  .describe('mailchimp api config');

export type MailchimpConfig = ReturnType<typeof mailchimpZ.parse>;

export const mailchimpEnvConfig = (): MailchimpConfig => {
  const rawConfig = {
    mailchimp: {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
      isEnabled: process.env.MAILCHIMP_IS_ENABLED,
      listId: process.env.MAILCHIMP_LIST_ID,
    },
  };

  return mailchimpZ.parse(rawConfig);
};
