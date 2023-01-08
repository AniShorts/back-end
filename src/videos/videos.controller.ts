import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  async createVideo(@Body() createVideoDto: CreateVideoDto) {
    return await this.videosService.createVideo(createVideoDto);
  }

  @Get()
  async findAllVideos() {
    //랜덤으로 비디오 보여주는 거??
    return await this.videosService.findAllVideos();
  }

  @Get(':id')
  async findOneVideo(@Param('id') id: number) {
    return await this.videosService.findOneVideo(+id);
  }

  @Patch(':id')
  async updateVideo(
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return await this.videosService.updateVideo(+id, updateVideoDto);
  }

  @Delete(':id')
  async deleteVideo(@Param('id') id: number) {
    return await this.videosService.deleteVideo(+id);
  }
}
