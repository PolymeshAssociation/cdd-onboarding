import { WebClient } from '@slack/web-api';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';
import { SlackMessageService } from './slackMessage.service';

describe('SlackMessageService', () => {
  let service: SlackMessageService;
  let slackClient: DeepMocked<WebClient>;
  let configService: DeepMocked<ConfigService>;
  let logger: DeepMocked<Logger>;

  const mockChannel = 'mock-channel';
  const mockHeader = 'Test Header';
  const mockBody = 'Test Body';

  beforeEach(() => {
    slackClient = createMock<WebClient>({
      chat: {
        postMessage: jest.fn(),
      },
    });
    configService = createMock<ConfigService>();
    logger = createMock<Logger>();

    configService.getOrThrow.mockReturnValue(mockChannel);

    service = new SlackMessageService(slackClient, configService, logger);
  });

  describe('sendMessage', () => {
    it('should send a message to Slack', async () => {
      await service.sendMessage({ header: mockHeader, body: mockBody });

      expect(slackClient.chat.postMessage).toHaveBeenCalledWith({
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
      (slackClient.chat.postMessage as jest.Mock).mockRejectedValue(
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
