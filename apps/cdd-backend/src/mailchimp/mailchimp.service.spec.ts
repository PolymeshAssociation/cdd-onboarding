import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MailchimpService } from './mailchimp.service';
import { Status } from '@mailchimp/mailchimp_marketing';

jest.mock('@mailchimp/mailchimp_marketing');

const mockMailchimpClient = {
  setConfig: jest.fn(),
  ping: {
    get: jest.fn(),
  },
  lists: {
    addListMember: jest.fn(),
  },
};

describe('MailchimpService', () => {
  let service: MailchimpService;

  const mockConfigService = createMock<ConfigService>(); // mock for constructor

  beforeEach(async () => {
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
          provide: 'MAILCHIMP_CLIENT',
          useValue: mockMailchimpClient,
        },
        MailchimpService,
      ],
    }).compile();

    service = module.get<MailchimpService>(MailchimpService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exposedService = service as any;
    exposedService.businessId = 'mesh-test';
    exposedService.accessToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY3ODg5MzI1NiwianRpIjoiZDVjYzU0YjViNzgyNDA0YmJhYzM2ZDVkMDdmYzU1ZDIiLCJ1c2VyX2lkIjoiYWJkZWU2ZTQtM2I3Ny00YjI0LWEwMjUtOGVkNDAzNzM5NzAzIn0.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ping', () => {
    it('should return true when isEnabled is false', async () => {
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'mailchimp.isEnabled') {
          return false;
        }
      });

      const result = await service.ping();
      expect(result).toBe(true);
    });

    it('should return true when isEnabled is true and Mailchimp returns a successful response', async () => {
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'mailchimp.isEnabled') {
          return true;
        }
      });

      mockMailchimpClient.ping.get.mockResolvedValue({});

      const result = await service.ping();
      expect(result).toBe(true);
      expect(mockMailchimpClient.ping.get).toHaveBeenCalled();
    });

    it('should throw an error when isEnabled is true and Mailchimp returns an error response', async () => {
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'mailchimp.isEnabled') {
          return true;
        }
      });

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
    const status: Status = 'subscribed';
    const mockListId = 'mock_list_id';

    beforeEach(() => {
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'mailchimp.isEnabled') {
          return true; // default isEnabled to true
        } else if (key === 'mailchimp.listId') {
          return mockListId;
        }
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return true when isEnabled is false', async () => {
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === 'mailchimp.isEnabled') {
          return false;
        }
        if (key === 'mailchimp.listId') {
          return mockListId;
        }
      });

      const result = await service.addSubscriberToMarketingList(email, status);
      expect(result).toBe(true);
    });

    it('should return true when isEnabled is true and Mailchimp returns a successful response', async () => {
      mockMailchimpClient.lists.addListMember.mockResolvedValue({});

      const result = await service.addSubscriberToMarketingList(email, status);
      expect(result).toBe(true);
      expect(mockMailchimpClient.lists.addListMember).toHaveBeenCalledWith(
        mockListId,
        {
          email_address: email,
          status,
          marketing_permissions: undefined,
        }
      );
    });

    it('should return true when isEnabled is true and Mailchimp returns an error response', async () => {
      mockMailchimpClient.lists.addListMember.mockRejectedValue(
        new Error('Mailchimp Error')
      );

      const result = await service.addSubscriberToMarketingList(email, status);
      expect(result).toBe(true);
      expect(mockMailchimpClient.lists.addListMember).toHaveBeenCalledWith(
        mockListId,
        {
          email_address: email,
          status,
          marketing_permissions: undefined,
        }
      );
    });
  });
});
