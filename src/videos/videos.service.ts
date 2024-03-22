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
    return await this.videosRepository.find({
      relations: ['categories'],
    });
  }
  //동영상 하나
  async findOneVideo(id: number): Promise<Video> {
    const video = await this.videosRepository.findOne({
      where: { videoId: id },
      relations: ['categories'],
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
    let newCategoryIds = await this.categoryListService.checkCategory(
      updateVideoDto.categories,
    );
    console.log('newCategoryIds: ', newCategoryIds);

    // Update categories using the new dedicated function
    await this.updateVideoCategories(id, newCategoryIds);

    // Update the video entity itself (excluding categories from DTO)
    const { categories, ...videoUpdateData } = updateVideoDto;
    await this.videosRepository.update(id, videoUpdateData);

    // Optionally, fetch and return the updated video with its categories
    return this.findOneVideo(id);
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

  async updateVideoCategories(videoId: number, newCategoryIds: number[]) {
    // Fetch current categories associated with the video
    const currentCategories = await this.categoryvideoService.findByVideoId(
      videoId,
    );
    const currentCategoryIds = currentCategories.map((c) => c.categoryId);

    // Determine categories to add and remove
    const categoriesToAdd = newCategoryIds.filter(
      (id) => !currentCategoryIds.includes(id),
    );
    const categoriesToRemove = currentCategoryIds.filter(
      (id) => !newCategoryIds.includes(id),
    );

    // Remove categories that are no longer associated
    await this.categoryvideoService.removeByVideoId(
      videoId,
      categoriesToRemove,
    );

    // Add new category associations
    for (const categoryId of categoriesToAdd) {
      await this.categoryvideoService.create({ videoId, categoryId });
    }
  }
}
