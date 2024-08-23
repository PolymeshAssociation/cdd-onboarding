import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { App as SlackApp } from '@slack/bolt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackMessageService {
  private readonly channel: string;

  constructor(
    private readonly slackApp: SlackApp,
    private readonly config: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.channel = this.config.getOrThrow('slackApp.channel');
  }

  async sendMessage(message: { header: string; body: string }): Promise<void> {
    try {
      await this.slackApp.client.chat.postMessage({
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
}
