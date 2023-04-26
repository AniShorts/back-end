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
import {Video} from '../../videos/entities/video.entity'

@Entity({
  orderBy:{
      userId: 'DESC'
    }
})
export class Users {
  
  // @OneToMany(() => Video, (video:Video) => video.userId)
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  userId:number;

  @ApiProperty()
  @PrimaryColumn({
      type: 'varchar',
      comment: 'nickname',
  })
  nickname:string;

  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'user_password',
    })
  password:string;
  
  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'phonenumber',
    })
  phone:string;
  
  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'profile_img',
    })
  profileImg:string;

}
