import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MailchimpService } from './mailchimp.service';
import { Status } from '@mailchimp/mailchimp_marketing';
import { MAILCHIMP_CLIENT_PROVIDER } from './mailchimp.provider';
import { createHash } from 'crypto';

jest.mock('@mailchimp/mailchimp_marketing');

const mockMailchimpClient = {
  setConfig: jest.fn(),
  ping: {
    get: jest.fn(),
  },
  lists: {
    setListMember: jest.fn(),
    updateListMemberTags: jest.fn(),
  },
};

const createTestModule = async (isEnabled: boolean, mockListId: string) => {
  const mockConfigService = createMock<ConfigService>();

  mockConfigService.getOrThrow.mockImplementation((key: string) => {
    if (key === 'mailchimp.isEnabled') {
      return isEnabled;
    }
    if (key === 'mailchimp.listId') {
      return mockListId;
    }
  });

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: WINSTON_MODULE_PROVIDER,
        useValue: createMock<Logger>(),
      },
      {
        provide: ConfigService,
        useValue: mockConfigService,
      },
      {
        provide: MAILCHIMP_CLIENT_PROVIDER,
        useValue: mockMailchimpClient,
      },
      MailchimpService,
    ],
  }).compile();

  return module;
};

describe('MailchimpService', () => {
  let service: MailchimpService;
  let isEnabled = true;
  const mockListId = 'mockListId';




  beforeEach(async () => {
    const module = await createTestModule(isEnabled, mockListId)
    service = module.get<MailchimpService>(MailchimpService);
  });

  afterEach(() => {
    isEnabled = true;
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ping', () => {
    it('should return true when isEnabled is false', async () => {
      isEnabled = false;
      const module = await createTestModule(isEnabled, mockListId)
      service = module.get<MailchimpService>(MailchimpService);
      const result = await service.ping();
      expect(result).toBe(true);
    });

    it('should return true when isEnabled is true and Mailchimp returns a successful response', async () => {
      mockMailchimpClient.ping.get.mockResolvedValue({});

      const result = await service.ping();
      expect(result).toBe(true);
      expect(mockMailchimpClient.ping.get).toHaveBeenCalled();
    });

    it('should throw an error when isEnabled is true and Mailchimp returns an error response', async () => {
      // Mock a Mailchimp error response
      mockMailchimpClient.ping.get.mockRejectedValue(
        new Error('Mailchimp Error')
      );

      await expect(service.ping()).rejects.toThrow('Mailchimp Error');
      expect(mockMailchimpClient.ping.get).toHaveBeenCalled();
    });
  });

  describe('addSubscriberToMarketingList', () => {
    const email = 'test@example.com';
    const emailHash = createHash('md5').update(email.toLowerCase()).digest('hex');
    const status: Status = 'subscribed';


    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not call the service if not enabled', async () => {
      isEnabled = false;
      const module = await createTestModule(isEnabled, mockListId)
      service = module.get<MailchimpService>(MailchimpService);

      await service.addSubscriberToMarketingList(email, status);

      expect(mockMailchimpClient.lists.setListMember).not.toHaveBeenCalled();
    });

    it('should call the service and return result', async () => {
      mockMailchimpClient.lists.setListMember.mockResolvedValue({});
      mockMailchimpClient.lists.updateListMemberTags.mockResolvedValue({});

      await service.addSubscriberToMarketingList(email, status);

      expect(mockMailchimpClient.lists.setListMember).toHaveBeenCalledWith(
        mockListId,
        emailHash,
        {
          email_address: email,
          status_if_new: status,
          marketing_permissions: undefined,
        }
      );
    });

    it('should return true when isEnabled is true and Mailchimp returns an error response', async () => {
      mockMailchimpClient.lists.setListMember.mockRejectedValue(
        new Error('Mailchimp Error')
      );
      mockMailchimpClient.lists.updateListMemberTags.mockRejectedValue(
        new Error('Mailchimp Error')
      );

      await service.addSubscriberToMarketingList(email, status);

      expect(mockMailchimpClient.lists.setListMember).toHaveBeenCalledWith(
        mockListId,
        emailHash,
        {
          email_address: email,
          status_if_new: status,
          marketing_permissions: undefined,
        }
      );
    });
  });
});
