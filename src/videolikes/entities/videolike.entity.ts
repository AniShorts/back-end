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

  @Column()
  videoId: number;

  @Column()
  likeStatus: boolean;
}
