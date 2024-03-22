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
import { CategorylistController } from 'src/categorylist/categorylist.controller';
import { Like } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { error } from 'console';
import { CategorylistService } from 'src/categorylist/categorylist.service';
import { create } from 'domain';
import { CategoryvideoService } from 'src/categoryvideo/categoryvideo.service';
@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
    private categoryListService: CategorylistService,
    private categoryvideoService: CategoryvideoService,
  ) {}
  //동영상 업로드
  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    let categoryIds = await this.categoryListService.checkCategory(
      createVideoDto.categories,
    );
    console.log('categoryIds:', categoryIds);
    const video = this.videosRepository.create({
      ...createVideoDto,
    });
    await this.videosRepository.save(video);
    console.log('video:', video);
    //여기서 categoryvideo 생성
    for (const categoryId of categoryIds) {
      await this.categoryvideoService.create({
        videoId: video.videoId,
        categoryId: categoryId,
      });
    }

    return video;
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
      where: { user: { userId: id } },
      relations: ['user'],
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
  /*   async searchByCate(keyword: SearchVideoDto) {
    const searchedVideosByCategory = await this.videosRepository.find({
      where: { categories: Like(`%${keyword.keyword}%`) },
    });
    return searchedVideosByCategory;
  } */
}
