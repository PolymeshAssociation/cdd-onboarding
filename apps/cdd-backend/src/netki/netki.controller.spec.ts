import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { API_KEY_GUARD_CREDENTIALS_PROVIDER } from '../common/api-key.guard';
import { BASIC_AUTH_CREDENTIALS_PROVIDER } from '../common/basic-auth.guard';
import { NetkiController } from './netki.controller';
import { NetkiService } from './netki.service';
import { NetkiBusinessCallbackDto, NetkiCallbackDto } from './types';

describe('NetkiController', () => {
  let controller: NetkiController;
  let mockService: DeepMocked<NetkiService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetkiController],
      providers: [
        {
          provide: NetkiService,
          useValue: createMock<NetkiService>(),
        },
        {
          provide: BASIC_AUTH_CREDENTIALS_PROVIDER,
          useValue: [],
        },
        {
          provide: API_KEY_GUARD_CREDENTIALS_PROVIDER,
          useValue: [],
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: createMock<Logger>(),
        },
      ],
    }).compile();

    controller = module.get<NetkiController>(NetkiController);
    mockService = module.get<typeof mockService>(NetkiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAccessCodes', () => {
    it('should call the service', async () => {
      mockService.fetchAccessCodes.mockResolvedValue({
        added: 2,
        total: 3,
      });

      const result = await controller.fetchAccessCodes();

      expect(result).toEqual({ added: 2, total: 3 });
    });
  });

  describe('callback', () => {
    it('should call the service', async () => {
      const fakeData = 'test-data';
      mockService.queueCddJob.mockResolvedValue(undefined);

      await controller.callback(fakeData as unknown as NetkiCallbackDto);

      expect(mockService.queueCddJob).toHaveBeenCalledWith(fakeData);
    });
  });

  describe('business callback', () => {
    it('should call the service', async () => {
      const fakeData = 'test-data';
      mockService.queueBusinessJob.mockResolvedValue(undefined);

      await controller.businessCallback(
        fakeData as unknown as NetkiBusinessCallbackDto
      );

      expect(mockService.queueBusinessJob).toHaveBeenCalledWith(fakeData);
    });
  });
});
