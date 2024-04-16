import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { UsersModule } from 'src/users/users.module';
import { CategorylistModule } from 'src/categorylist/categorylist.module';
import { CategoryvideoModule } from 'src/categoryvideo/categoryvideo.module';

@Module({
  imports: [
    UsersModule,
    CategorylistModule,
    CategoryvideoModule,
    TypeOrmModule.forFeature([Video]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
