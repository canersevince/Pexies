import { Test, TestingModule } from '@nestjs/testing';
import { FlickrService } from './flickr.service';

describe('FlickrService', () => {
  let service: FlickrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlickrService],
    }).compile();

    service = module.get<FlickrService>(FlickrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
