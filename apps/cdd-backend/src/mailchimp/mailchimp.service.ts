import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import to from 'await-to-js';

import client, { ErrorResponse, Status } from '@mailchimp/mailchimp_marketing';
import { MAILCHIMP_CLIENT_PROVIDER } from './mailchimp.provider';

type MarketingPermission = {
  marketing_permission_id: string;
  enabled: boolean;
};

type MailchimpPingResponse = client.ping.APIHealthStatus | ErrorResponse
type MailchimpListResponse = ErrorResponse | client.lists.MembersSuccessResponse

@Injectable()
export class MailchimpService {
  private listId: string;
  private readonly isEnabled: boolean;

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
    status: Status
  ): Promise<boolean> {
    return this.addSubscriberToList(email, this.listId, status);
  }

  private async addSubscriberToList(
    email: string,
    listId: string,
    status: Status,
    marketingPermissions?: MarketingPermission[]
  ): Promise<boolean> {
    if (!this.isEnabled) {
      this.logger.info('Mailchimp is disabled, skipping addSubscriberToList');

      return true;
    }

    const [error, result] = await to<MailchimpListResponse>(this.mailchimpClient.lists.addListMember(listId, {
      email_address: email,
      status,
      marketing_permissions: marketingPermissions,
    }));

    if(error){
      this.logger.error('Mailchimp Error', { error });
    }

    if (result && this.isMailchimpErrorResponse(result)) {
      this.logger.error('Mailchimp Error', { error: result });  
    }

    return true;
  }

  private isMailchimpErrorResponse(
    obj:
      | client.ping.APIHealthStatus
      | client.lists.MembersSuccessResponse
      | ErrorResponse
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
