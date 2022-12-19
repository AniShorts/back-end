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
    orderBy:{
        userId: 'DESC'
      }
})
export class Users {
    @PrimaryGeneratedColumn('increment')
    userId:number;

    @PrimaryColumn({
        type: 'varchar',
        comment: 'nickname',
    })
    nickname:string;

    @Column({
        type: 'varchar',
        comment: 'user_password',
      })
    password:string;
    
    @Column({
        type: 'varchar',
        comment: 'phonenumber',
      })
    phone:string;

    @Column({
        type: 'json',
        comment: 'like_animal_kind',
      })
    category:string[];

    @Column({
        type: 'varchar',
        comment: 'profile_img',
      })
    profileImg:string;
}
