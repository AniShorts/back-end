import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm/index';

import { ApiProperty } from '@nestjs/swagger';
import { Video } from 'src/videos/entities/video.entity';
import { Categorylist } from 'src/categorylist/entities/categorylist.entity';

@Entity({
  orderBy: {
    id: 'DESC',
  },
})
export class Categoryvideo {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  videoId: number;

  @ManyToOne(() => Categorylist, (categorylist) => categorylist.categoryId)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'categoryId' })
  category: Categorylist;

  @ManyToOne(() => Video, (video) => video.videoId)
  @JoinColumn({ name: 'videoId', referencedColumnName: 'videoId' })
  video: Video;
}
