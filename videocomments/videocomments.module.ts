import { Module } from '@nestjs/common';
import { VideocommentsService } from './videocomments.service';
import { VideocommentsController } from './videocomments.controller';

@Module({
  controllers: [VideocommentsController],
  providers: [VideocommentsService]
})
export class VideocommentsModule {}
