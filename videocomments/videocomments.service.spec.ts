import { Test, TestingModule } from '@nestjs/testing';
import { VideocommentsService } from './videocomments.service';

describe('VideocommentsService', () => {
  let service: VideocommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideocommentsService],
    }).compile();

    service = module.get<VideocommentsService>(VideocommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
