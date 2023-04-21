import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import client, { ErrorResponse, Status } from '@mailchimp/mailchimp_marketing';

type MarketingPermission = {
    marketing_permission_id: string;
    enabled: boolean;
}

@Injectable()
export class MailchimpService {
  private isEnabled: boolean;
  private mailchimpClient: typeof client;
  private listId: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    config: ConfigService
  ) {
    const apiKey = config.getOrThrow('mailchimp.apiKey');
    const serverPrefix = config.getOrThrow('mailchimp.serverPrefix');

    this.listId = config.getOrThrow('mailchimp.listId');
    this.isEnabled = config.getOrThrow('mailchimp.isEnabled');
    this.mailchimpClient = client;

    this.logger.debug('mailchimp config', { apiKey, serverPrefix });

    this.mailchimpClient.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });
  }

  public async ping(): Promise<boolean> {
    if(!this.isEnabled) {
        return true;
    }

    try {
      const result = await this.mailchimpClient.ping.get();

      if (this.isMailchimpErrorResponse(result)) {
        this.logger.error('Mailchimp Error', { error: result });

        throw new Error('Mailchimp Error');
      }

      return true;
    } catch (error) {
      this.logger.error('Mailchimp Error', { error });

      throw new Error('Mailchimp Error');
    }
  }

  public async addSubscriberToMarketingList(email: string, status: Status): Promise<boolean> {
    return this.addSubscriberToList(
      email,
      this.listId,
      status,
    );
  }

  private async addSubscriberToList(email: string, listId: string, status: Status, marketingPermissions?: MarketingPermission[]): Promise<boolean> {
    if(!this.isEnabled) {
        return true;
    }

    try {
      const result = await this.mailchimpClient.lists.addListMember(
        listId,
        {
          email_address: email,
          status,
          marketing_permissions: marketingPermissions
        }
      );

      if (this.isMailchimpErrorResponse(result)) {
        this.logger.error('Mailchimp Error', { error: result });

      }
    } catch (error) {
      this.logger.error('Mailchimp Error', { error });
    }

    return true; // We don't want to fail the whole process if mailchimp fails
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
