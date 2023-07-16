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
import { Users } from 'src/users/entities/user.entity';
  
@Entity()
export class Oauth {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id:number;
  
  
  @ApiProperty()
  @ManyToOne((type) => Users,{ nullable: false })
  @JoinColumn({name:"userId",referencedColumnName: "userId"})
  user: Users;

  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'sns id',
    })
  snsId:string;

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

  @ApiProperty()
  @Column({
      type: 'varchar',
      comment: 'signup type',
    })
  vender:string;

}
