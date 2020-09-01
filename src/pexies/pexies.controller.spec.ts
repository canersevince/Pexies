import { Test, TestingModule } from '@nestjs/testing';
import { PexiesController } from './pexies.controller';

describe('PexiesController', () => {
  let controller: PexiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PexiesController],
    }).compile();

    controller = module.get<PexiesController>(PexiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
