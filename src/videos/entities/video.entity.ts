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
  JoinColumn,
} from 'typeorm';

import { Users } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Categoryvideo } from 'src/categoryvideo/entities/categoryvideo.entity';
import { Videolike } from 'src/videolikes/entities/videolike.entity';
import { Categorylist } from 'src/categorylist/entities/categorylist.entity';

@Entity({
  orderBy: {
    videoId: 'DESC',
  },
})
export class Video extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  videoId: number;

  @ApiProperty()
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;

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
  @Column({
    type: 'varchar',
    comment: 'The destination of a video',
  })
  videoDest: string;

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

  @ManyToMany(() => Categorylist)
  @JoinTable({
    name: 'categoryvideo', // Join table name
    joinColumn: { name: 'videoId', referencedColumnName: 'videoId' }, // Correct, assuming videoId is Video's PK
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'categoryId',
    }, // Correct, assuming categoryId is Categorylist's PK
  })
  categories?: Categorylist[];
}
