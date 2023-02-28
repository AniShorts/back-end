import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Videolike {
  @PrimaryColumn()
  videoLikeId: number;

  @Column()
  userId: number;

  @Column()
  videoId: number;

  @Column()
  likeStatus: boolean;
}
