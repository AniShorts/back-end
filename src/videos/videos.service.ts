import { Injectable } from '@nestjs/common';
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
    console.log('service', createVideoDto);

    const newVideo = this.videosRepository.create({
      userId,
      ...createVideoDto,
    });
    console.log('newVideo', newVideo);
    return await this.videosRepository.save(newVideo);
  }

  findAll() {
    return `This action returns all videos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
