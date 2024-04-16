import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm/index';

import { ApiProperty } from '@nestjs/swagger';
import { Video } from 'src/videos/entities/video.entity';

@Entity({
  orderBy: {
    categoryId: 'DESC',
  },
})
export class Categorylist {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  categoryId: number;

  @ApiProperty()
  @Column()
  categoryName: string;

  @ManyToMany(() => Video, (video) => video.categories)
  videos?: Video[];
}
