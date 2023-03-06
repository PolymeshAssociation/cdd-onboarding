import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { JumioController } from './jumio.controller';
import { JumioService } from './jumio.service';

import { JumioCallbackDto } from './types';

import mockRequest from '../test-utils/jumio-http/webhook-approved-verified.json';

describe('JumioController', () => {
  let controller: JumioController;
  const mockService = createMock<JumioService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JumioController],
      providers: [
        {
          provide: JumioService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<JumioController>(JumioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processCddApplication', () => {
    it('should call the service', async () => {
      mockService.queueApplication.mockResolvedValue(undefined);

      await controller.processCddApplication(mockRequest as JumioCallbackDto);

      expect(mockService.queueApplication).toHaveBeenCalledWith(mockRequest);
    });
  });
});
