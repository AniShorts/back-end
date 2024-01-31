import { Timestamp } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';

export class CreateVideoDto {
  videoId: number;
  user: Users;
  likeNum: number;
  videoName: string;
  videoImg: string;
  videoDest: string;
  createdAt: Timestamp;
  views: number;
  commentNum: number;
  category: { id: number; name: string };
}
