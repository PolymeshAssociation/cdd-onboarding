import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { MrkdwnElement, WebClient } from '@slack/web-api';

@Injectable()
export class SlackMessageService {
  private readonly channel?: string;

  constructor(
    private readonly slackApp: WebClient,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.channel = this.config.get('slackApp.channel');
  }

  async sendMessage(message: { header: string; body: string }): Promise<void> {
    if (!this.channel) {
      return;
    }
    try {
      await this.slackApp.chat.postMessage({
        channel: this.channel,
        text: message.header,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: message.body,
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error('Failed to send message to Slack', error);
    }
  }

  async sendSectionedMessage(message: {
    header: string;
    fields: string[];
    sections: string[];
  }): Promise<void> {
    if (!this.channel) {
      return;
    }

    const sectionFields: MrkdwnElement[] = message.fields.map((field) => ({
      type: 'mrkdwn',
      text: field,
    }));

    try {
      await this.slackApp.chat.postMessage({
        channel: this.channel,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: message.header,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            fields: sectionFields,
          },
          ...message.sections.map((section) => ({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: section,
            },
          })),
        ],
      });
    } catch (error) {
      this.logger.error('Failed to send sectioned message to Slack', error);
    }
  }
}
