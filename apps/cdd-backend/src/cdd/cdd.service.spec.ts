import { Test, TestingModule } from '@nestjs/testing';
import { Polymesh } from '@polymeshassociation/polymesh-sdk';
import { CddService } from './cdd.service';
import { getQueueToken } from '@nestjs/bull';
import { MockPolymesh } from '../test-utils/mocks';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JumioService } from '../jumio/jumio.service';
import { NetkiService } from '../netki/netki.service';
import { Queue } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { BadRequestException } from '@nestjs/common';
import { MailchimpService } from '../mailchimp/mailchimp.service';
import { EmailDetailsDto } from '@cdd-onboarding/cdd-types';
import { AppRedisService } from '../app-redis/app-redis.service';
import { Account, Identity } from '@polymeshassociation/polymesh-sdk/types';
import { ConfigService } from '@nestjs/config';

describe('CddService', () => {
  const address = 'some-address';
  let mockPolymesh: MockPolymesh;
  let mockRedis: DeepMocked<AppRedisService>;
  let mockJumioService: DeepMocked<JumioService>;
  let mockMailchimpService: DeepMocked<MailchimpService>;
  let service: CddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CddService,
        { provide: Polymesh, useValue: new MockPolymesh() },
        { provide: getQueueToken(), useValue: createMock<Queue>() },
        { provide: AppRedisService, useValue: createMock<AppRedisService>() },
        { provide: JumioService, useValue: createMock<JumioService>() },
        { provide: NetkiService, useValue: createMock<NetkiService>() },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
        { provide: MailchimpService, useValue: createMock<MailchimpService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
      ],
    }).compile();

    service = module.get<CddService>(CddService);
    mockRedis = module.get<typeof mockRedis>(AppRedisService);
    mockJumioService = module.get<typeof mockJumioService>(JumioService);
    mockPolymesh = module.get<typeof mockPolymesh>(Polymesh);
    mockMailchimpService =
      module.get<typeof mockMailchimpService>(MailchimpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyAddress', () => {
    it('should return `true` if the address does not have an associated Identity', async () => {
      mockPolymesh.accountManagement.isValidAddress.mockReturnValue(true);
      mockPolymesh.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue(null),
      });

      const result = await service.verifyAddress(address);

      expect(result).toEqual({ valid: true, identity: null });
    });

    it('should return `false` if the address does have an associated Identity', async () => {
      mockPolymesh.accountManagement.isValidAddress.mockReturnValue(true);
      mockPolymesh.accountManagement.getAccount.mockResolvedValue({
        getIdentity: jest.fn().mockResolvedValue({
          did: 'someDid',
          hasValidCdd: jest.fn().mockResolvedValue(true),
        }),
      });

      const result = await service.verifyAddress(address);

      expect(result).toEqual({
        valid: false,
        identity: { did: 'someDid', validCdd: true },
      });
    });

    it('should throw BadRequest if address is not valid', async () => {
      mockPolymesh.accountManagement.isValidAddress.mockReturnValue(false);

      await expect(service.verifyAddress(address)).rejects.toThrowError(
        BadRequestException
      );
    });
  });

  describe('generateCddLink', () => {
    describe('when jumio is selected', () => {
      it('should generate a link and save a record of it', async () => {
        mockPolymesh.accountManagement.isValidAddress.mockReturnValue(true);
        mockPolymesh.accountManagement.getAccount.mockResolvedValue({
          getIdentity: jest.fn().mockResolvedValue(null),
        });

        const expectedLink = 'https://example.com/';

        mockJumioService.generateLink.mockResolvedValue({
          redirectUrl: expectedLink,
          transactionReference: 'test-ref',
          timestamp: 'test-time',
        });

        const link = await service.getProviderLink({
          address,
          provider: 'jumio',
          hCaptcha: 'someSecret',
        });

        expect(link).toEqual(expectedLink);

        expect(mockRedis.setApplication).toHaveBeenCalledWith(
          address,
          expect.objectContaining({
            url: expect.stringContaining(expectedLink),
          })
        );
      });
    });

    describe('when mock is selected', () => {
      it('should return a relative link', async () => {
        mockPolymesh.accountManagement.isValidAddress.mockReturnValue(true);
        mockPolymesh.accountManagement.getAccount.mockResolvedValue({
          getIdentity: jest.fn().mockResolvedValue(null),
        });

        const expectedLink = 'mock-cdd/';

        mockJumioService.generateLink.mockResolvedValue({
          redirectUrl: expectedLink,
          transactionReference: 'test-ref',
          timestamp: 'test-time',
        });

        const link = await service.getProviderLink({
          address,
          provider: 'mock',
          hCaptcha: 'someSecret',
        });

        expect(link).toEqual(expectedLink);
      });
    });
  });

  describe('processEmail', () => {
    it('should call addSubscriberToMarketingList if updatesAccepted = true with status subscribed', async () => {
      mockMailchimpService.addSubscriberToMarketingList.mockResolvedValue();

      const payload: EmailDetailsDto = {
        email: 'test@example.com',
        newsletterAccepted: true,
        devUpdatesAccepted: true,
        termsAccepted: true,
        hCaptcha: 'someSecret',
      };
      await service.processEmail(payload);

      expect(
        mockMailchimpService.addSubscriberToMarketingList
      ).toHaveBeenCalledWith(payload.email, 'subscribed', true, true);
    });

    it('should call addSubscriberToMarketingList if updatesAccepted = true with status transactional', async () => {
      mockMailchimpService.addSubscriberToMarketingList.mockResolvedValue();

      const payload: EmailDetailsDto = {
        email: 'test@example.com',
        newsletterAccepted: false,
        devUpdatesAccepted: false,
        termsAccepted: true,
        hCaptcha: 'someSecret',
      };
      await service.processEmail(payload);

      expect(
        mockMailchimpService.addSubscriberToMarketingList
      ).toHaveBeenCalledWith(payload.email, 'subscribed', false, false);
    });
  });

  describe('getApplications', () => {
    let mockAccount: DeepMocked<Account>;
    beforeEach(() => {
      mockAccount = createMock<Account>();
      mockPolymesh.accountManagement.getAccount.mockResolvedValue(mockAccount);

      mockRedis.getApplications.mockResolvedValue([
        {
          id: 'someId',
          address: 'someAddress',
          provider: 'netki',
          timestamp: 'someTime',
          url: 'someUrl',
          externalId: 'someExtId',
        },
      ]);
    });

    it('should return previous applications', async () => {
      mockAccount.getIdentity.mockResolvedValue(null);

      const result = await service.getApplications('someAddress');

      expect(result).toEqual({
        address: 'someAddress',
        applications: [{ provider: 'netki', timestamp: 'someTime' }],
        did: undefined,
      });
    });

    it('should not return application info for account with Identity', async () => {
      const mockIdentity = createMock<Identity>({ did: 'someDid' });
      mockAccount.getIdentity.mockResolvedValue(mockIdentity);

      const result = await service.getApplications('someAddress');

      expect(result).toEqual({
        address: 'someAddress',
        applications: [],
        did: 'someDid',
      });
    });
  });
});
