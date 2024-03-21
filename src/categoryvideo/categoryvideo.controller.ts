import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryvideoService } from './categoryvideo.service';
import { CreateCategoryvideoDto } from './dto/create-categoryvideo.dto';
import { UpdateCategoryvideoDto } from './dto/update-categoryvideo.dto';

@Controller('categoryvideo')
export class CategoryvideoController {
  constructor(private readonly categoryvideoService: CategoryvideoService) {}

  /*   @Post()
  async inputVideo(@Body() body) {
    return await this.categoryvideoService.create(body);
  }

  @Delete(':videoId')
  async delVideo(@Param() videoId: number) {
    return await this.categoryvideoService.removeByVideoId(videoId);
  } */

  /*   @Delete()
  async detailDelVideo(@Body() body: CreateCategoryvideoDto) {
    return await this.categoryvideoService.detailDelVideo(body);
  } */

  /*   @Get('/videoId/:videoId')
  async findVideo(@Param('videoId') videoId: number) {
    return await this.categoryvideoService.findByVideoId(videoId);
  } */
  /*   @Get('/category/:categoryId')
  async findCategory(@Param('categoryId') categoryId: number) {
    return await this.categoryvideoService.findCategory(categoryId);
  } */
}
