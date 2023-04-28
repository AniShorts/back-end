import { Module } from '@nestjs/common';
import { CategoryvideoService } from './categoryvideo.service';
import { CategoryvideoController } from './categoryvideo.controller';

@Module({
  controllers: [CategoryvideoController],
  providers: [CategoryvideoService]
})
export class CategoryvideoModule {}
