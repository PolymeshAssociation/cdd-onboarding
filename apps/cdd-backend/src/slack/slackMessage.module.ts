import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { workerEnvConfig } from '../config/worker';
import { SlackMessageService } from './slackMessage.service';
import { App as SlackApp } from '@slack/bolt';

@Module({
  imports: [ConfigModule.forFeature(() => workerEnvConfig())],
  providers: [
    {
      provide: SlackApp,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new SlackApp({
          signingSecret: config.getOrThrow('slackApp.signingSecret'),
          token: config.getOrThrow('slackApp.botToken'),
        });
      },
    },
    SlackMessageService,
  ],
  exports: [SlackMessageService],
})
export class SlackMessageModule {}
