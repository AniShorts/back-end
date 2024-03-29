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
import { ConfigModule } from '@nestjs/config';
import { Users } from './users/entities/user.entity';
import { Video } from './videos/entities/video.entity';
import { Walk } from './walks/entities/walk.entity';
import { AuthModule } from './auth/auth.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { CategorylistModule } from './categorylist/categorylist.module';
import { Category } from './category/entities/category.entity';
import { Categorylist } from './categorylist/entities/categorylist.entity';
import { Chatting } from './chattings/entities/chatting.entity';
import { CategoryvideoModule } from './categoryvideo/categoryvideo.module';
import { Categoryvideo } from './categoryvideo/entities/categoryvideo.entity';
import { Videolike } from './videolikes/entities/videolike.entity';
import { Walkcomment } from './walkcomments/entities/walkcomment.entity';
import { OauthModule } from './oauth/oauth.module';
import { Oauth } from './oauth/entities/oauth.entity';
const ENV = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        ENV.NODE_ENV === 'production'
          ? './.env/.production.env'
          : './.env/.development.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ENV.DATABASE_HOST,
      port: ENV.DATABASE_PORT as unknown as number,
      username: ENV.DATABASE_USERNAME,
      password: ENV.DATABASE_PASSWORD,
      database: ENV.DATABASE_DATABASE,
      entities: [
        Oauth,
        Users,
        Walk,
        Category,
        Categorylist,
        Video,
        Chatting,
        Categoryvideo,
        Videolike,
        Walkcomment,
        Oauth,
      ],

      synchronize: true,
    }),
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
    AuthModule,
    CategoryModule,
    CategorylistModule,
    CategoryvideoModule,
    OauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
