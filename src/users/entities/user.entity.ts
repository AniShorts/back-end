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
import { Video } from '../../videos/entities/video.entity';
import { Walk } from 'src/walks/entities/walk.entity';
import { Walkcomment } from 'src/walkcomments/entities/walkcomment.entity';
import { Oauth } from 'src/oauth/entities/oauth.entity';
import { Videolike } from 'src/videolikes/entities/videolike.entity';

@Entity({
  orderBy: {
    userId: 'DESC',
  },
})
export class Users {
  constructor(userId: number) {
    this.userId = userId;
  }
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  @OneToMany(() => Walkcomment, (walkcomment) => walkcomment.user)
  @OneToMany(() => Video, (video) => video.user)
  @OneToMany(() => Oauth, (Oauth) => Oauth.user)
  @OneToMany(() => Walk, (walk) => walk.user)
  @OneToMany(() => Videolike, (Videolike) => Videolike.user)
  userId: number;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'nickname',
  })
  nickname: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'user_password',
  })
  password: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'phonenumber',
  })
  phone: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'profile_img',
  })
  profileImg: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'access_token',
  })
  access: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'refresh_token',
  })
  refresh: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    comment: 'signup type',
  })
  vender: string;
}
