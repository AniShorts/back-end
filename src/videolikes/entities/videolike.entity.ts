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
  videolikeId: number;

  @ApiProperty()
  @ManyToOne(() => Users, (users) => users.userId)
  @Column({
    type: 'int',
    comment: 'user`s unique number',
  })
  userId: number;

  @ApiProperty()
  @ManyToOne(() => Video, (video) => video.videoId)
  @Column()
  videoId: number;
}
