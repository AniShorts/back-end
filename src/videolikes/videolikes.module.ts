import { Module } from '@nestjs/common';
import { VideolikesService } from './videolikes.service';
import { VideolikesController } from './videolikes.controller';

@Module({
  controllers: [VideolikesController],
  providers: [VideolikesService]
})
export class VideolikesModule {}
