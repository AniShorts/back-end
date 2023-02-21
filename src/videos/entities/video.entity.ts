import { Users } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  ManyToOne,
  Entity,
} from 'typeorm';

@Entity()
export class Video extends BaseEntity {
  @PrimaryGeneratedColumn()
  videoId: number;

  @Column()
  @ManyToOne(() => Users, users => users.userId)
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
