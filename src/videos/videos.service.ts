import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { Like } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { error } from 'console';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
  ) {}
  //동영상 업로드
  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const newVideo = this.videosRepository.create({
      ...createVideoDto,
    });
    console.log(9);
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
  //유저별
  async findUsersVideos(id: number) {
    const video = await this.videosRepository.find({
      where: {
        userId: id,
      },
    });

    if (!video) {
      throw new NotFoundException(`Can't find Video with id: ${id}`);
    }
    return video;
  }

  //동영상 업데이트
  async updateVideo(id: number, updateVideoDto: UpdateVideoDto) {
    console.log(updateVideoDto);
    const updatedVideo = await this.videosRepository.update(
      { videoId: id },
      { ...updateVideoDto },
    );
    return updatedVideo;
  }
  //동영상 삭제
  async deleteVideo(userId: number, videoId: number) {
    const result = await this.videosRepository.delete(videoId);
    return result;
  }

  //검색 - videoName으로 검색
  async searchByName(keyword: SearchVideoDto) {
    const searchedVideosByName = await this.videosRepository.find({
      where: { videoName: Like(`%${keyword.keyword}%`) },
    });
    return searchedVideosByName;
  }

  //검색 - category으로 검색
  async searchByCate(keyword: SearchVideoDto) {
    console.log(1);
    const searchedVideosByCategory = await this.videosRepository.find({
      where: { categories: Like(`%${keyword.keyword}%`) },
    });
    return searchedVideosByCategory;
  }
}
