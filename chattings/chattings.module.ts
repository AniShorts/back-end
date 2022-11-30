import { Module } from '@nestjs/common';
import { ChattingsService } from './chattings.service';
import { ChattingsGateway } from './chattings.gateway';

@Module({
  providers: [ChattingsGateway, ChattingsService]
})
export class ChattingsModule {}
