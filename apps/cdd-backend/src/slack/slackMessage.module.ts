import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { workerEnvConfig } from '../config/worker';
import { SlackMessageService } from './slackMessage.service';
import { App as SlackApp } from '@slack/bolt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Module({
  imports: [ConfigModule.forFeature(() => workerEnvConfig())],
  providers: [
    {
      provide: SlackApp,
      inject: [ConfigService, WINSTON_MODULE_PROVIDER],
      useFactory: (config: ConfigService, logger: Logger) => {
        const signingSecret = config.get('slackApp.signingSecret');
        const token = config.get('slackApp.botToken');
        if (signingSecret && token) {
          return new SlackApp({
            signingSecret: config.get('slackApp.signingSecret'),
            token: config.get('slackApp.botToken'),
          });
        } else {
          logger.info('Slack is not configured');
        }
      },
    },
    SlackMessageService,
  ],
  exports: [SlackMessageService],
})
export class SlackMessageModule {}
