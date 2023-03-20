import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ALLOWED_IPS_TOKEN } from '../common/ip-filter.guard';
import { NetkiController } from './netki.controller';
import { NetkiService } from './netki.service';
import { NetkiCallbackDto } from './types';

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
          provide: ALLOWED_IPS_TOKEN,
          useValue: [],
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
        fetched: 2,
        total: 3,
      });

      const result = await controller.fetchAccessCodes();

      expect(result).toEqual({ fetched: 2, total: 3 });
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
});
