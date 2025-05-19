import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { FinclusiveController } from './finclusive.controller';

import { FinclusiveCallbackDto } from './types';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CALLBACK_API_KEYS_PROVIDER } from '../common/callback-api-key.guard';
import { ALLOWED_IPS_PROVIDER } from '../common/ip-filter.guard';
import mockRequest from '../test-utils/finclusive-http/webhook-cdd-status.json';
import { FinclusiveService } from './finclusive.service';

describe('FinclusiveController', () => {
  let controller: FinclusiveController;
  let mockService: DeepMocked<FinclusiveService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinclusiveController],
      providers: [
        {
          provide: FinclusiveService,
          useValue: createMock<FinclusiveService>(),
        },
        {
          provide: ALLOWED_IPS_PROVIDER,
          useValue: [],
        },
        {
          provide: CALLBACK_API_KEYS_PROVIDER,
          useValue: ['some-api-key'],
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: createMock<Logger>(),
        },
      ],
    }).compile();

    controller = module.get<FinclusiveController>(FinclusiveController);
    mockService = module.get<typeof mockService>(FinclusiveService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processCddApplication', () => {
    it('should call the service', async () => {
      mockService.queueApplication.mockResolvedValue(undefined);

      await controller.processCddApplication(
        mockRequest as FinclusiveCallbackDto,
        'ClientComplianceStatusChange'
      );

      expect(mockService.queueApplication).toHaveBeenCalledWith(
        mockRequest,
        'ClientComplianceStatusChange'
      );
    });
  });
});
