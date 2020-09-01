import { Test, TestingModule } from '@nestjs/testing';
import { FlickerControllerController } from './flicker-controller.controller';

describe('FlickerControllerController', () => {
  let controller: FlickerControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlickerControllerController],
    }).compile();

    controller = module.get<FlickerControllerController>(FlickerControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
