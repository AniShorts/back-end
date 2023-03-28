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

export class Categorylist {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id:number;

    @ApiProperty()
    @PrimaryColumn({
        type: 'int',
        comment: 'category name',
    })
    category:string;}
