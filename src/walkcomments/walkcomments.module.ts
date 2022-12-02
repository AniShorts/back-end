import { Module } from '@nestjs/common';
import { WalkcommentsService } from './walkcomments.service';
import { WalkcommentsController } from './walkcomments.controller';

@Module({
  controllers: [WalkcommentsController],
  providers: [WalkcommentsService]
})
export class WalkcommentsModule {}
