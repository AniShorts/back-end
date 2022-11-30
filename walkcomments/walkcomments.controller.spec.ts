import { Test, TestingModule } from '@nestjs/testing';
import { WalkcommentsController } from './walkcomments.controller';
import { WalkcommentsService } from './walkcomments.service';

describe('WalkcommentsController', () => {
  let controller: WalkcommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalkcommentsController],
      providers: [WalkcommentsService],
    }).compile();

    controller = module.get<WalkcommentsController>(WalkcommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
