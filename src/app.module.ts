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
<<<<<<< HEAD
=======
import { CategoryController } from './category/category.controller';
>>>>>>> acb1b034b43c1af5c0712cece629d135adb39b94
import { CategoryModule } from './category/category.module';
import { CategorylistModule } from './categorylist/categorylist.module';
import { Category } from './category/entities/category.entity';
import { Categorylist } from './categorylist/entities/categorylist.entity';
<<<<<<< HEAD
const ENV = process.env;
=======
import { Chatting } from './chattings/entities/chatting.entity';
const ENV = process.env;

>>>>>>> acb1b034b43c1af5c0712cece629d135adb39b94

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
<<<<<<< HEAD
      entities: [Users, Video, Category, Categorylist, Walk],
=======
      entities: [Users,Walk,Category,Categorylist,Video,Chatting],

>>>>>>> acb1b034b43c1af5c0712cece629d135adb39b94
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
