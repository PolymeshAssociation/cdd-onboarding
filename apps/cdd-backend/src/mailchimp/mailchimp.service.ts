import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import to from 'await-to-js';
import { createHash } from 'crypto';

import client, { ErrorResponse, Status } from '@mailchimp/mailchimp_marketing';
import { MAILCHIMP_CLIENT_PROVIDER } from './mailchimp.provider';

type MarketingPermission = {
  marketing_permission_id: string;
  enabled: boolean;
};

type MailchimpPingResponse = client.ping.APIHealthStatus | ErrorResponse
type MailchimpListResponse = ErrorResponse | client.lists.MembersSuccessResponse
type ListMemberTag = { name: string, status: 'active' | "inactive" }

@Injectable()
export class MailchimpService {
  private listId: string;
  private readonly isEnabled: boolean;
  private onboardingTagName: string;
  private newsletterTagName: string;
  private devUpdatesTagName: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(MAILCHIMP_CLIENT_PROVIDER)
    private readonly mailchimpClient: typeof client,
    private readonly config: ConfigService
  ) {
    const apiKey = this.config.getOrThrow('mailchimp.apiKey');
    const serverPrefix = this.config.getOrThrow('mailchimp.serverPrefix');

    this.listId = this.config.getOrThrow('mailchimp.listId');
    this.isEnabled = this.config.getOrThrow('mailchimp.isEnabled');
    this.logger.debug('mailchimp config', { serverPrefix });
    this.onboardingTagName = this.config.getOrThrow('mailchimp.onboardingTagName');
    this.newsletterTagName = this.config.getOrThrow('mailchimp.newsletterTagName');
    this.devUpdatesTagName = this.config.getOrThrow('mailchimp.devUpdatesTagName');

    this.mailchimpClient.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });
  }

  public async ping(): Promise<boolean> {
    if (!this.isEnabled) {
      return true;
    }

    // have to cast to unknown since mailchimp types don't show this as a promise
    const [err, result] = await to<MailchimpPingResponse>(this.mailchimpClient.ping.get() as unknown as Promise<MailchimpPingResponse>);

    if(err){
      this.logger.error('Mailchimp Error', { error: err });

      throw new Error('Mailchimp Error');
    }

    if(result && this.isMailchimpErrorResponse(result)){
      this.logger.error('Mailchimp Error', { error: result });

      throw new Error('Mailchimp Error');
    }

    this.logger.info("Mailchimp ping success", { result });

    return true;
  }

  public async addSubscriberToMarketingList(
    email: string,
    status: Status,
    subscribeToNewsletter = false,
    subscribeToDevUpdates = false,
  ): Promise<void> {
    return this.addSubscriberToList(email, this.listId, status, subscribeToNewsletter, subscribeToDevUpdates);
  }




  private async addSubscriberToList(
    email: string,
    listId: string,
    status: Status,
    subscribeToNewsletter = false,
    subscribeToDevUpdates = false,
    marketingPermissions?: MarketingPermission[]
  ): Promise<void> {
    if (!this.isEnabled) {
      this.logger.info('Mailchimp is disabled, skipping addSubscriberToList');

      return;
    }

    const subscriberHash = createHash('md5').update(email.toLowerCase()).digest('hex');

    const [error, result] = await to<MailchimpListResponse>(this.mailchimpClient.lists.setListMember(listId, subscriberHash,  {
      email_address: email,
      status_if_new: status,
      marketing_permissions: marketingPermissions,
  
    }));

    if(error){
      this.logger.error('Mailchimp Error', { error });

      return;
    }

    if (result && this.isMailchimpErrorResponse(result)) {
      this.logger.error('Mailchimp Error', { error: result });  

      return;
    }

    const tags: ListMemberTag[] = [{ name: this.onboardingTagName, status: 'active'}];

    if(subscribeToNewsletter){
      tags.push({ name: this.newsletterTagName, status: 'active' });
    }

    if(subscribeToDevUpdates){
      tags.push({ name: this.devUpdatesTagName, status: 'active' });
    }

    const [tagsError, tagsResult] = await to<object>(this.mailchimpClient.lists.updateListMemberTags(listId, subscriberHash, { tags }))

    if(tagsError){
      this.logger.error('Mailchimp Error', { tagsError });
    }

    if (tagsResult && this.isMailchimpErrorResponse(tagsResult)) {
      this.logger.error('Mailchimp Error', { error: tagsResult });  
    }

    return;
  }

  private isMailchimpErrorResponse(
    obj:
      | client.ping.APIHealthStatus
      | client.lists.MembersSuccessResponse
      | ErrorResponse
      | object
  ): obj is ErrorResponse {
    return (
      (obj as ErrorResponse).status !== undefined &&
      ![
        HttpStatus.OK,
        HttpStatus.CREATED,
        HttpStatus.ACCEPTED,
        HttpStatus.NO_CONTENT,
      ].includes((obj as ErrorResponse).status)
    );
  }
}
