import { Test, TestingModule } from '@nestjs/testing';
import { VideolikesController } from './videolikes.controller';
import { VideolikesService } from './videolikes.service';

describe('VideolikesController', () => {
  let controller: VideolikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideolikesController],
      providers: [VideolikesService],
    }).compile();

    controller = module.get<VideolikesController>(VideolikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
