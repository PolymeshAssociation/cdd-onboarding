import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { SlackMessageService } from './slackMessage.service';
import { App as SlackApp } from '@slack/bolt';

describe('SlackMessageService', () => {
  let service: SlackMessageService;
  let slackApp: DeepMocked<SlackApp>;
  let configService: DeepMocked<ConfigService>;
  let logger: DeepMocked<Logger>;

  const mockChannel = 'mock-channel';
  const mockHeader = 'Test Header';
  const mockBody = 'Test Body';

  beforeEach(() => {
    slackApp = createMock<SlackApp>({
      client: {
        chat: {
          postMessage: jest.fn(),
        },
      },
    });
    configService = createMock<ConfigService>();
    logger = createMock<Logger>();

    configService.getOrThrow.mockReturnValue(mockChannel);

    service = new SlackMessageService(slackApp, configService, logger);
  });

  describe('sendMessage', () => {
    it('should send a message to Slack', async () => {
      await service.sendMessage({ header: mockHeader, body: mockBody });

      expect(slackApp.client.chat.postMessage).toHaveBeenCalledWith({
        channel: mockChannel,
        text: mockHeader,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mockBody,
            },
          },
        ],
      });
    });

    it('should log an error if Slack message fails', async () => {
      (slackApp.client.chat.postMessage as jest.Mock).mockRejectedValue(
        new Error('Slack API Error')
      );

      await service.sendMessage({ header: mockHeader, body: mockBody });

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to send message to Slack',
        expect.any(Error)
      );
    });
  });
});
