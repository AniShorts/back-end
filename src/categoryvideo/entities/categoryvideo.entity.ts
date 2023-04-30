import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm/index';

import { ApiProperty } from '@nestjs/swagger';

@Entity({
  orderBy: {
    videoId: 'DESC',
  },
})
export class Categoryvideo {
  @ApiProperty()
  @PrimaryColumn({
    type: 'int',
    comment: 'video id',
  })
  videoId: number;

  @ApiProperty()
  @PrimaryColumn({
    type: 'int',
    comment: 'video id',
  })
  categoryId: number;
}
