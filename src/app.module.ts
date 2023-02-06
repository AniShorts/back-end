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
import { Walk } from './walks/entities/walk.entity';
import { AuthModule } from './auth/auth.module';
const ENV=process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (ENV.NODE_ENV === 'production') ? './.env/.production.env' : './.env/.development.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ENV.DATABASE_HOST,
      port: ENV.DATABASE_PORT as unknown as number,
      username: ENV.DATABASE_USERNAME,
      password: ENV.DATABASE_PASSWORD,
      database: ENV.DATABASE_DATABASE,
      entities: [Users,Walk],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
