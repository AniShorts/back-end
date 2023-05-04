import { Test, TestingModule } from '@nestjs/testing';
import { CategoryvideoController } from './categoryvideo.controller';
import { CategoryvideoService } from './categoryvideo.service';

describe('CategoryvideoController', () => {
  let controller: CategoryvideoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryvideoController],
      providers: [CategoryvideoService],
    }).compile();

    controller = module.get<CategoryvideoController>(CategoryvideoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
