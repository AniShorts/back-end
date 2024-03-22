import { Injectable } from '@nestjs/common';
import { CreateCategoryvideoDto } from './dto/create-categoryvideo.dto';
import { UpdateCategoryvideoDto } from './dto/update-categoryvideo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoryvideo } from './entities/categoryvideo.entity';
import { Repository } from 'typeorm';
import internal from 'stream';

@Injectable()
export class CategoryvideoService {
  constructor(
    @InjectRepository(Categoryvideo)
    private categoryvideoRepository: Repository<Categoryvideo>,
  ) {
    this.categoryvideoRepository = categoryvideoRepository;
  }
  public async create(body: { videoId: number; categoryId: number }) {
    return await this.categoryvideoRepository.save({
      video: { videoId: body.videoId },
      categoryId: body.categoryId,
    });
  }
  /* 
  async removeByVideoId(videoId: number) {
    return await this.categoryvideoRepository.delete({
      video: { videoId: videoId },
    });
    // return `This action removes a #${id} category`;
  } */
  /* 
  async detailDelVideo(createCategoryvideoDto: CreateCategoryvideoDto) {
    return await this.categoryvideoRepository.delete({
      video:{videoId:createCategoryvideoDto.video.videoId},categoryId:createCategoryvideoDto.categoryId
    });
  } */

  public async findByVideoId(videoId: number): Promise<Categoryvideo[]> {
    let list = await this.categoryvideoRepository.find({
      where: {
        video: { videoId: videoId },
      },
    });
    return list;
  }

  /*   async findCategory(categoryId: number): Promise<Categoryvideo[]> {
    let list = await this.categoryvideoRepository.find({
      where: {
        categoryId: categoryId,
      },
    });
    return list;
  } */
}
