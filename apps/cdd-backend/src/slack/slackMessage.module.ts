import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebClient } from '@slack/web-api';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { workerEnvConfig } from '../config/worker';
import { SlackMessageService } from './slackMessage.service';

@Module({
  imports: [ConfigModule.forFeature(() => workerEnvConfig())],
  providers: [
    {
      provide: WebClient,
      inject: [ConfigService, WINSTON_MODULE_PROVIDER],
      useFactory: (config: ConfigService, logger: Logger) => {
        const token = config.get('slackApp.botToken');
        if (token) {
          const token = config.get('slackApp.botToken');
          return new WebClient(token);
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
