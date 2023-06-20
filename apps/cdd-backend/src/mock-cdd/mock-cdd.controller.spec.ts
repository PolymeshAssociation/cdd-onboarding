import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { MockCddController } from './mock-cdd.controller';
import { MockCddService } from './mock-cdd.service';

describe('MockCddController', () => {
  let controller: MockCddController;
  let mockService: DeepMocked<MockCddService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockCddController],
      providers: [
        {
          provide: MockCddService,
          useValue: createMock<MockCddService>(),
        },
      ],
    }).compile();

    controller = module.get<MockCddController>(MockCddController);
    mockService = module.get<typeof mockService>(MockCddService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submitMockCdd', () => {
    it('should call the service', async () => {
      const mockBody = { address: 'someAddress', id: '1' } as const;

      await controller.submitMockCdd(mockBody);

      expect(mockService.queueMockCddJob).toHaveBeenCalledWith(mockBody);
    });
  });
});
