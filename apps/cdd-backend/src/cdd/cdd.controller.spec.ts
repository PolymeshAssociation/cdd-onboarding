import { Test, TestingModule } from '@nestjs/testing';
import { CddController } from './cdd.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CddService } from './cdd.service';
import {
  ProviderLinkResponse,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';
import {
  HCaptchaGuard,
  HCAPTCHA_GUARD_CREDENTIALS_PROVIDER,
} from '../common/hcaptcha.guard';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

const address = 'some-address';
describe('CddController', () => {
  let controller: CddController;
  let mockCddService: DeepMocked<CddService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CddService,
          useValue: createMock<CddService>(),
        },
        {
          provide: HCaptchaGuard,
          useValue: createMock<HCaptchaGuard>(),
        },
        {
          provide: HCAPTCHA_GUARD_CREDENTIALS_PROVIDER,
          useValue: 'someSecret',
        },
        { provide: WINSTON_MODULE_PROVIDER, useValue: createMock<Logger>() },
      ],
      controllers: [CddController],
    }).compile();

    controller = module.get<CddController>(CddController);
    mockCddService = module.get<typeof mockCddService>(CddService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyAddress', () => {
    it('should call the service and return the result', async () => {
      mockCddService.verifyAddress.mockResolvedValue({
        valid: true,
        identity: null,
      });

      const response = await controller.verifyAddress({
        address,
        hCaptcha: 'someSecret',
      });

      expect(response).toEqual(new VerifyAddressResponse(true, null));
    });
  });

  describe('generateProviderLink', () => {
    it('should call the service and return the result', async () => {
      mockCddService.getProviderLink.mockResolvedValue('https://example.com');

      const response = await controller.providerLink({
        address,
        provider: 'jumio',
        hCaptcha: 'someSecret',
      });

      expect(response).toEqual(new ProviderLinkResponse('https://example.com'));
    });
  });

  describe('emailAddress', () => {
    it('should call the service and return the result', async () => {
      mockCddService.processEmail.mockResolvedValue(true);

      const response = await controller.emailAddress({
        email: 'test@email.com',
        termsAccepted: true,
        updatesAccepted: true,
        hCaptcha: 'someSecret',
      });

      expect(response).toEqual(true);
    });
  });
});
