import { Test, TestingModule } from '@nestjs/testing';
import { NudityDetectionService } from './nudity-detection.service';

describe('NudityDetectionService', () => {
  let service: NudityDetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NudityDetectionService],
    }).compile();

    service = module.get<NudityDetectionService>(NudityDetectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
