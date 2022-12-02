import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FollowsModule } from './follows/follows.module';
import { BlocksModule } from './blocks/blocks.module';
import { CommentlikesModule } from './commentlikes/commentlikes.module';
import { VideolikesModule } from './videolikes/videolikes.module';
import { WalksModule } from './walks/walks.module';
import { WalkcommentsModule } from './walkcomments/walkcomments.module';
import { VideosModule } from './videos/videos.module';
import { VideocommentsModule } from './videocomments/videocomments.module';
import { ChattingsModule } from './chattings/chattings.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,
    FollowsModule,
    BlocksModule,
    CommentlikesModule,
    VideolikesModule,
    WalksModule,
    WalkcommentsModule,
    VideosModule,
    VideocommentsModule,
    ChattingsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'test',
      database: 'Anishorts',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, //서비스가 실행되고 데이터베이스가 연결될 때 항상 데이터베이스가 초기화 되므로 절대 프로덕션에는 true로 하지 마세요!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
