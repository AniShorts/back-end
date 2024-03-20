import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';
import { Timestamp } from 'typeorm';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  videoId: number;
  userId: number;
  likeNum: number;
  videoName: string;
  videoImg: string;
  videoDest: string;
  updatedAt: Timestamp;
  views: number;
  commentNum: number;
  categories: { id: number; name: string };
}
