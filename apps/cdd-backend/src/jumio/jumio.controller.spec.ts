import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { JumioController } from './jumio.controller';
import { JumioService } from './jumio.service';

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
      mockService.queueApplication.mockResolvedValue(true);

      const mockRequest = {
        idScanStatus: 'APPROVED_VERIFIED',
        jumioIdScanReference: 'someUUID',
        idScanSource: 'WEB',
        verificationStatus: 'APPROVED_VERIFIED',
        callbackDate: new Date(),
        transactionDate: new Date(),
      } as const;

      await controller.processCddApplication(mockRequest);

      expect(mockService.queueApplication).toHaveBeenCalledWith(mockRequest);
    });
  });
});
