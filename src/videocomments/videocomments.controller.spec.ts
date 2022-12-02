import { Test, TestingModule } from '@nestjs/testing';
import { VideocommentsController } from './videocomments.controller';
import { VideocommentsService } from './videocomments.service';

describe('VideocommentsController', () => {
  let controller: VideocommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideocommentsController],
      providers: [VideocommentsService],
    }).compile();

    controller = module.get<VideocommentsController>(VideocommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
