import { Test, TestingModule } from '@nestjs/testing';
import { CategorylistService } from './categorylist.service';

describe('CategorylistService', () => {
  let service: CategorylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorylistService],
    }).compile();

    service = module.get<CategorylistService>(CategorylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
