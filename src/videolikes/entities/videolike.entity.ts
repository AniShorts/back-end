import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';
import { Video } from 'src/videos/entities/video.entity';

@Entity({
  orderBy: {
    videoLikeId: 'DESC',
  },
})
export class Videolike extends BaseEntity {
  @PrimaryGeneratedColumn()
  videoLikeId: number;

  @ApiProperty()
  @ManyToOne((type) => Video, { nullable: false })
  @JoinColumn({ name: 'videoId', referencedColumnName: 'videoId' })
  videoId: number;

  @ApiProperty()
  @ManyToOne(() => Users, (users) => users.userId)
  userId: number;
  @Column({
    type: 'int',
    comment: 'user`s unique number',
  })
  @Column()
  likeStatus: boolean;
  /*   @ApiProperty()
  @PrimaryGeneratedColumn()
  videoLikeId: number;

  @ManyToOne((type) => Video, { nullable: false })
  @JoinColumn({ name: 'videoId', referencedColumnName: 'videoId' })
  video: Video;

  @ApiProperty()
  @ManyToOne(() => Users, (users) => users.userId)
  @Column({
    type: 'int',
    comment: 'user`s unique number',
  })
  userId: number;

  @Column()
  videoId: number;

  @Column()
  likeStatus: boolean; */
}
