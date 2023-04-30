import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { Like } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video) private videosRepository: Repository<Video>,
  ) {}
  //동영상 업로드
  async createVideo(
    userId: number,
    createVideoDto: CreateVideoDto,
  ): Promise<Video> {
    console.log(userId);
    createVideoDto.userId = userId;
    const newVideo = this.videosRepository.create({
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

  //검색 - videoName으로 검색
  async searchByName(keyword: SearchVideoDto) {
    const searchedVideosByName = await this.videosRepository.find({
      where: { videoName: Like(`%${keyword.keyword}%`) },
    });
    console.log('searchedVideosByName', searchedVideosByName);

    return searchedVideosByName;
  }

  //검색 - category으로 검색
  async searchByCate(keyword: SearchVideoDto) {
    const searchedVideosByCategory = await this.videosRepository.find({
      where: { category: Like(`%${keyword.keyword}%`) },
    });
    console.log('searchedVideosByCategory', searchedVideosByCategory);
    /*   
      //중복 제거
      let set = new Set(searchedVideosByName.concat(searchedVideosByCategory));
      const searchedVideos = [...set];
      searchedVideos.filter((element, index) => {
        return searchedVideos.indexOf(element) === index;
      });
      console.log('searchedVideos', searchedVideos); */

    return searchedVideosByCategory;
  }
}
