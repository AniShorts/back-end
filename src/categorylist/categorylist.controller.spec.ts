import { Test, TestingModule } from '@nestjs/testing';
import { CategorylistController } from './categorylist.controller';
import { CategorylistService } from './categorylist.service';

describe('CategorylistController', () => {
  let controller: CategorylistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorylistController],
      providers: [CategorylistService],
    }).compile();

    controller = module.get<CategorylistController>(CategorylistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
