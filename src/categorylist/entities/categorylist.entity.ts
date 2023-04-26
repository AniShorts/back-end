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
        id: 'DESC'
      }
  })

export class Categorylist {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id:number;

    @ApiProperty()
    @PrimaryColumn({
        type: 'varchar',
        comment: 'category name',
    })
    category:string;
  }