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
    orderBy:{
        userId: 'DESC'
      }
  })
export class Category {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    userId:number;

    @ApiProperty()
    @PrimaryColumn({
        type: 'int',
        comment: 'category id',
    })
    categoryId:number;

}