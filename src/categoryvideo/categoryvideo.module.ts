import { Module } from '@nestjs/common';
import { CategoryvideoService } from './categoryvideo.service';
import { CategoryvideoController } from './categoryvideo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoryvideo } from './entities/categoryvideo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoryvideo])],
  controllers: [CategoryvideoController],
  providers: [CategoryvideoService],
})
export class CategoryvideoModule {}
