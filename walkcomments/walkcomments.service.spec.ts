import { Test, TestingModule } from '@nestjs/testing';
import { WalkcommentsService } from './walkcomments.service';

describe('WalkcommentsService', () => {
  let service: WalkcommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalkcommentsService],
    }).compile();

    service = module.get<WalkcommentsService>(WalkcommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
