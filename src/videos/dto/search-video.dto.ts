import { Video } from '../entities/video.entity';
import { Timestamp } from 'typeorm';

export class SearchVideoDto {
  userId: number;
  videoId: number;
  videoName: string;
  categories: any[];
  keyword: string;
}
