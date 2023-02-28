import { Module } from '@nestjs/common';
import { VideolikesService } from './videolikes.service';
import { VideolikesController } from './videolikes.controller';
import { Videolike } from './entities/videolike.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Videolike])],
  controllers: [VideolikesController],
  providers: [VideolikesService],
})
export class VideolikesModule {}
