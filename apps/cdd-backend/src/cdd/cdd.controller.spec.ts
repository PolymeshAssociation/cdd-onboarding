import { Test, TestingModule } from '@nestjs/testing';
import { CddController } from './cdd.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CddService } from './cdd.service';
import {
  ProviderLinkResponse,
  VerifyAddressResponse,
} from '@cdd-onboarding/cdd-types';

const address = 'some-address';
describe('CddController', () => {
  let controller: CddController;
  let mockCddService: DeepMocked<CddService>;

  beforeEach(async () => {
    mockCddService = createMock<CddService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CddService,
          useValue: mockCddService,
        },
      ],
      controllers: [CddController],
    }).compile();
    controller = module.get<CddController>(CddController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('verifyAddress', () => {
    it('should call the service and return the result', async () => {
      mockCddService.verifyAddress.mockResolvedValue({
        valid: true,
        previousLinks: [],
      });

      const response = await controller.verifyAddress({ address });

      expect(response).toEqual(new VerifyAddressResponse(true, []));
    });
  });

  describe('generateProviderLink', () => {
    it('should call the service and return the result', async () => {
      mockCddService.getProviderLink.mockResolvedValue('https://example.com');

      const response = await controller.providerLink({
        address,
        provider: 'jumio',
      });

      expect(response).toEqual(new ProviderLinkResponse('https://example.com'));
    });
  });
});
