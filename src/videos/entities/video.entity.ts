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
  @ManyToOne(() => Users, (users) => users.userId)
  @Column({
    type: 'int',
    comment: 'user`s unique number',
  })
  userId: number;

  @ApiProperty()
  @Column()
  likeNum: number;

  @ApiProperty()
  @Column()
  videoName: string;

  @ApiProperty()
  @Column()
  videoImg: string;

  @ApiProperty()
  @Column()
  videoDest: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Timestamp;

  @ApiProperty()
  @Column()
  views: number;

  @ApiProperty()
  @Column()
  commentNum: number;

  @ApiProperty()
  @Column('json')
  category: { id: number; name: string };

  @ApiProperty()
  @OneToMany(() => Categoryvideo, (categoryvideo) => categoryvideo.video)
  categoryVideos: Categoryvideo[];
}
