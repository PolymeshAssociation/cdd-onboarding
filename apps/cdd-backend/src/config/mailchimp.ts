import { z } from 'zod';

const mailchimpZ = z
  .object({
    mailchimp: z.object({
      apiKey: z.string().describe('mailchimp api key'),
      serverPrefix: z.string().describe('mailchimp server prefix'),
      isEnabled: z.enum(['true', 'false']).transform((val) => val === 'true'),
      listId: z.string().describe('mailchimp list id'),
      onboardingTagName: z.string().describe('mailchimp onboarding tag name'),
      newsletterTagName: z.string().describe('mailchimp newsletter tag name'),
      devUpdatesTagName: z.string().describe('mailchimp dev updates tag name'),
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
      onboardingTagName: process.env.MAILCHIMP_ONBOARDING_TAG_NAME,
      newsletterTagName: process.env.MAILCHIMP_NEWSLETTER_TAG_NAME,
      devUpdatesTagName: process.env.MAILCHIMP_DEV_UPDATES_TAG_NAME,
    },
  };

  return mailchimpZ.parse(rawConfig);
};
