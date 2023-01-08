import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
  ) {}

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const userId = 1;

    const newVideo = this.videosRepository.create({
      userId,
      ...createVideoDto,
    });
    return await this.videosRepository.save(newVideo);
  }

  async findAllVideos() {
    return await this.videosRepository.find();
  }

  async findOneVideo(id: number): Promise<Video> {
    const video = await this.videosRepository.findOne({
      where: {
        videoId: id,
      },
    });

    if (!video) {
      throw new NotFoundException(`Can't find Video with id: ${id}`);
    }
    return video;
  }

  async updateVideo(id: number, updateVideoDto: UpdateVideoDto) {
    const updatedVideo = await this.videosRepository.update(
      { videoId: id },
      { ...updateVideoDto },
    );
    return updatedVideo;
  }

  async deleteVideo(id: number) {
    const result = await this.videosRepository.delete(id);
    return result;
  }
}
