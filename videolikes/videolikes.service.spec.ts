import { Test, TestingModule } from '@nestjs/testing';
import { VideolikesService } from './videolikes.service';

describe('VideolikesService', () => {
  let service: VideolikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideolikesService],
    }).compile();

    service = module.get<VideolikesService>(VideolikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
