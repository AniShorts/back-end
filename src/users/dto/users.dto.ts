import { 
    Column, 
    Entity, 
    PrimaryColumn, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
 } from 'typeorm/index';
 import { Exclude } from 'class-transformer';
 import { ApiProperty } from '@nestjs/swagger';

@Entity({
    orderBy:{
        userId: 'DESC'
      }
})
export class Users {
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
        type: 'json',
        comment: 'like_animal_kind',
      })
    category:object[];
    
    @ApiProperty()
    @Column({
        type: 'varchar',
        comment: 'profile_img',
      })
    profileImg:string;

}
