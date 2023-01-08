import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  ManyToOne,
  Entity,
} from 'typeorm';

//import { User } from '../../users/entities';

@Entity()
export class Video extends BaseEntity {
  @PrimaryGeneratedColumn()
  videoId: number;

  /* @ManyToOne(() => User, (user) => user.videos)
  user: User; */

  @Column()
  userId: number;

  @Column()
  likeNum: number;

  @Column()
  videoName: string;

  @Column()
  videoImg: string;

  @Column()
  videoDest: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @Column()
  views: number;

  @Column()
  commentNum: number;

  @Column('simple-json')
  category: { id: number; name: string };
}
