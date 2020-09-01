import { Test, TestingModule } from '@nestjs/testing';
import { PexelsControllerController } from './pexels-controller.controller';

describe('PexelsControllerController', () => {
  let controller: PexelsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PexelsControllerController],
    }).compile();

    controller = module.get<PexelsControllerController>(PexelsControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
