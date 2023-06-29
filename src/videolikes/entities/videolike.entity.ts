import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
} from 'typeorm';

import { Users } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Video } from 'src/videos/entities/video.entity';

@Entity({
  orderBy: {
    videolikeId: 'DESC',
  },
})
export class Videolike extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @ManyToOne(() => Users, (users) => users.userId)
  @ManyToOne(() => Video, (video) => video.videoId)
  videolikeId: number;

  @ApiProperty()
  @Column({
    type: 'int',
    comment: 'user`s unique number',
  })
  userId: number;

  @ApiProperty()
  @Column()
  videoId: number;
}
