import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { Like } from 'typeorm';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
  ) {}
  //동영상 업로드
  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const userId = 1;

    const newVideo = this.videosRepository.create({
      userId,
      ...createVideoDto,
    });
    return await this.videosRepository.save(newVideo);
  }
  //전체 동영상
  async findAllVideos() {
    return await this.videosRepository.find();
  }
  //동영상 하나
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
  //동영상 업데이트
  async updateVideo(id: number, updateVideoDto: UpdateVideoDto) {
    const updatedVideo = await this.videosRepository.update(
      { videoId: id },
      { ...updateVideoDto },
    );
    return updatedVideo;
  }
  //동영상 삭제
  async deleteVideo(id: number) {
    const result = await this.videosRepository.delete(id);
    return result;
  }

  //검색 - QueryBuilder를 사용해서 구현해야 할 듯
  async searchVideos(keyword: SearchVideoDto) {
    const searchedVideos = await this.videosRepository.find({
      where: { videoName: Like(`%${keyword.keyword}%`) },
    });

    return searchedVideos;
  }
}
