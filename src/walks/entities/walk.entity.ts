import { 
    Column, 
    Entity, 
    PrimaryColumn, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
  } from 'typeorm/index';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/users/entities/user.entity';
import { Walkcomment } from 'src/walkcomments/entities/walkcomment.entity';
  
@Entity({
orderBy:{
    walkId: 'DESC'
    }
})

export class Walk {
    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    @OneToMany(type => Walkcomment, walkcomment => walkcomment.walk)
    walkId:number;
    
    @ApiProperty()
    @Column({
        type: 'varchar',
        comment: 'title of walk post',
      })
    walkTitle:string;
    
    @ApiProperty()
    @Column({
        type: 'varchar',
        comment: 'content written by the user.',
      })
    walkContent:string;
    
    @ApiProperty()
    @Column({
        type: 'varchar',
        comment: 'location that user write',
      })
    location:string;
    
    @ApiProperty()
    @Column({
        type: 'timestamp',
        comment: 'location that user write',
      })
    @ApiProperty()
    date:Date;
    

    @ApiProperty()
    @ManyToOne(() => Users, users => users.userId)
    @Column({
      type: 'int',
      comment: 'user`s unique number',
    })
    userId:number;
    
    @ApiProperty() 
    @Column({
        type: 'int',
        comment: 'chatting room`s unique number',
      })
    chatId:number;
    
    @ApiProperty()
    @Column({
        type: 'int',
        comment: 'Maximum number of users in a chat room',
      })
    maxNum:number;
    
    @ApiProperty()
    @Column({
        type: 'int',
        comment: 'Current number of users in the chat room',
      })
    curNum:number;
}