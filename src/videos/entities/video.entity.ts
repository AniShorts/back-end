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

@Entity({
  orderBy: {
    videoId: 'DESC',
  },
})
export class Video extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @OneToMany(() => Categoryvideo, (categoryvideo) => categoryvideo.videoId)
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
}
