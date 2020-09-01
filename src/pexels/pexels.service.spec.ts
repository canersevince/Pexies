import { Test, TestingModule } from '@nestjs/testing';
import { PexelsService } from './pexels.service';

describe('PexelsService', () => {
  let service: PexelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PexelsService],
    }).compile();

    service = module.get<PexelsService>(PexelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
