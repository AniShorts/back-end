import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/common/utils/multer.options.factory';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
