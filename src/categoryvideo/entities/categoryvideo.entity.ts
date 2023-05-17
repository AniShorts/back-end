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
} from 'typeorm/index';

import { ApiProperty } from '@nestjs/swagger';
import { Video } from 'src/videos/entities/video.entity';

@Entity({
  orderBy: {
    videoId: 'DESC',
  },
})
export class Categoryvideo {
  @PrimaryGeneratedColumn('increment')
  @PrimaryColumn()
  id: number;

  @ManyToOne((type) => Video, { nullable: false })
  @JoinColumn({ name: 'videoId', referencedColumnName: 'videoId' })
  video: Video;

  @Column({
    type: 'int',
    comment: 'video id',
  })
  categoryId: number;
}
