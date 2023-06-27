import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  ManyToOne,
  Entity,
  OneToMany,
} from 'typeorm';

import { Users } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Categoryvideo } from 'src/categoryvideo/entities/categoryvideo.entity';
import { Videolike } from 'src/videolikes/entities/videolike.entity';

@Entity({
  orderBy: {
    videoId: 'DESC',
  },
})
export class Video extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Categoryvideo, (categoryvideo) => categoryvideo.video)
  @OneToMany((type) => Videolike, (videolike) => videolike.video)
  videoId: number;

  @ApiProperty()
  @Column({
    type: 'int',
    comment: 'user`s unique number',
  })
  userId: number;

  @ApiProperty()
  @Column({
    type: 'int',
    comment: 'The number of videolike',
  })
  likeNum: number;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'video_name',
  })
  videoName: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'The destination of a video image',
  })
  videoImg: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Timestamp;

  @ApiProperty()
  @Column({
    type: 'int',
    comment: 'The views of a video',
  })
  views: number;

  @ApiProperty()
  @Column({
    type: 'int',
    comment: 'The number of comments',
  })
  commentNum: number;

  @ApiProperty()
  @Column('json')
  category: { id: number; name: string };
  categoryVideos: Categoryvideo[];
}
