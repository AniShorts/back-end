import { Test, TestingModule } from '@nestjs/testing';
import { ChattingsGateway } from './chattings.gateway';
import { ChattingsService } from './chattings.service';

describe('ChattingsGateway', () => {
  let gateway: ChattingsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChattingsGateway, ChattingsService],
    }).compile();

    gateway = module.get<ChattingsGateway>(ChattingsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
