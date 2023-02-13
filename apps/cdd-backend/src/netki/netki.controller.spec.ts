import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { NetkiController } from './netki.controller';
import { NetkiService } from './netki.service';
import { NetkiCallbackDto } from './types';

describe('NetkiController', () => {
  let controller: NetkiController;
  const mockService = createMock<NetkiService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NetkiController],
      providers: [
        {
          provide: NetkiService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NetkiController>(NetkiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('fetchAccessCodes', () => {
    it('should call the service', async () => {
      mockService.fetchAccessCodes.mockResolvedValue({
        fetchCount: 2,
        totalCount: 3,
      });

      const result = await controller.fetchAccessCodes();

      expect(result).toEqual('Added 2 access codes. Current code count: 3');
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
