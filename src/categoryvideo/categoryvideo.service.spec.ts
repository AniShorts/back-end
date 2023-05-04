import { Test, TestingModule } from '@nestjs/testing';
import { CategoryvideoService } from './categoryvideo.service';

describe('CategoryvideoService', () => {
  let service: CategoryvideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryvideoService],
    }).compile();

    service = module.get<CategoryvideoService>(CategoryvideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
