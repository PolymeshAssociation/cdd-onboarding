import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

describe('InfoController', () => {
  let controller: InfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: InfoService, useValue: createMock<InfoService>() },
      ],
      controllers: [InfoController],
    }).compile();

    controller = module.get<InfoController>(InfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
