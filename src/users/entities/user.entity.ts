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
import { Walk } from 'src/walks/entities/walk.entity';

@Entity({
  orderBy:{
      userId: 'DESC'
    }
})
export class Users {
  
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  @OneToMany(() => Video, video => video.userId)
  @OneToMany(() => Walk, walk => walk.userId)
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

  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'access_token',
    })
  access:string;

  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'refresh_token',
    })
    refresh:string;

}
