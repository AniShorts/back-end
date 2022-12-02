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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
