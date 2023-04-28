import { Injectable } from '@nestjs/common';
import { CreateCategoryvideoDto } from './dto/create-categoryvideo.dto';
import { UpdateCategoryvideoDto } from './dto/update-categoryvideo.dto';

@Injectable()
export class CategoryvideoService {
  create(createCategoryvideoDto: CreateCategoryvideoDto) {
    return 'This action adds a new categoryvideo';
  }

  findAll() {
    return `This action returns all categoryvideo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryvideo`;
  }

  update(id: number, updateCategoryvideoDto: UpdateCategoryvideoDto) {
    return `This action updates a #${id} categoryvideo`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryvideo`;
  }
}
