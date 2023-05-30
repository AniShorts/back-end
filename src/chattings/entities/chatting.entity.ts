import { Walk } from 'src/walks/entities/walk.entity';
import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm/index';

@Entity({
    orderBy: {
        chatId: 'DESC'
    }
})
export class Chatting {
    constructor(chatId:number){
        this.chatId=chatId
    }
    @PrimaryGeneratedColumn('increment')
    @OneToMany(() => Walk, walk => walk.user)
    chatId: number;

    @Column({
        type:'varchar',
        comment:'make room'
    })
    owner:number;

    @Column({
        type: 'json',
        comment: 'chatting room in userIds',
    })
    users: Number[];

    @Column({
        type: 'int',
        comment: 'chatting room max member',
    })
    maxNum: number;

    @Column({
        type: 'int',
        comment: 'chatting room in member',
    })
    curNum: number;
}
