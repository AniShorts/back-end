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

@Entity({
  orderBy: {
    categoryId: 'DESC',
  },
})
export class Categoryvideo extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  categoryId: number;

  @ManyToOne((type) => Video, { nullable: false })
  @JoinColumn({ name: 'videoId', referencedColumnName: 'videoId' })
  video: Video;
}
