import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Entity,
  OneToMany,
} from 'typeorm';

import { Users } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Categoryvideo } from 'src/categoryvideo/entities/categoryvideo.entity';
import { Category } from 'src/category/entities/category.entity';
import { Videolike } from 'src/videolikes/entities/videolike.entity';

@Entity({
  orderBy: {
    videoId: 'DESC',
  },
})
export class Video extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @OneToMany(() => Videolike, (videolikes) => videolikes.videoId)
  videoId: number;

  @ApiProperty()
  @ManyToOne(() => Users, (users) => users.userId)
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
  /* 
  @ApiProperty()
  @OneToMany(() => Categoryvideo, (categoryvideo) => categoryvideo.categoryId)
  @Column('json')
  category: { id: number; name: string };
  categoryVideos: Categoryvideo[]; */
  @ApiProperty()
  @ManyToMany(() => Category, { cascade: true })
  @JoinTable()
  categories: Category[];

  @ApiProperty()
  @OneToMany(() => Categoryvideo, (categoryvideo) => categoryvideo.video)
  categoryVideos: Categoryvideo[];
}
