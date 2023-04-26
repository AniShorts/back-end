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
    @PrimaryGeneratedColumn('increment')
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
    users: Object[];

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
