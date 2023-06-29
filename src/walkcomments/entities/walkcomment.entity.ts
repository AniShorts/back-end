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
import {Video} from '../../videos/entities/video.entity'
import { Walk } from 'src/walks/entities/walk.entity';
import { Users } from 'src/users/entities/user.entity';

@Entity({
orderBy:{
    walkCommentId: 'DESC'
    }
})
export class Walkcomment {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment') 
    @PrimaryColumn()
    walkCommentId:number;

    @ManyToOne((type) => Users,{ nullable: false })
    @JoinColumn({name:"userId",referencedColumnName: "userId"})
    user: Users;
    
    @ManyToOne((type) => Walk,{ nullable: false })
    @JoinColumn({name:"walkId",referencedColumnName: "walkId"})
    walk: Walk;

    @ApiProperty()
    @Column({
        type: 'varchar',
        comment: 'content of walk comment',
      })
    walkComment:string;
}
  
  