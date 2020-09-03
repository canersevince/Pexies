import { Test, TestingModule } from '@nestjs/testing';
import { PhotoGeneratorsService } from './photo-generators.service';

describe('PhotoGeneratorsService', () => {
  let service: PhotoGeneratorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoGeneratorsService],
    }).compile();

    service = module.get<PhotoGeneratorsService>(PhotoGeneratorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
