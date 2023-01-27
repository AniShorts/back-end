import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { Video } from './entities/video.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  //동영상 업로드
  @Post()
  async createVideo(@Body() createVideoDto: CreateVideoDto) {
    return await this.videosService.createVideo(createVideoDto);
  }

  //전체 동영상
  @Get('')
  async findAllVideos() {
    //랜덤으로 비디오 보여주는 거??
    return await this.videosService.findAllVideos();
  }

  //검색-동영상 하나를 불러오는 GET 요청이 @param을 받기 때문에 순서때문에 애러 발생
  @Get('search')
  async searchVideos(@Query() searchVideoDto: SearchVideoDto) {
    return await this.videosService.searchVideos(searchVideoDto);
  }

  //동영상 하나
  @Get(':id')
  async findOneVideo(@Param('id') id: number) {
    return await this.videosService.findOneVideo(+id);
  }

  //동영상 업데이트
  @Patch(':id')
  async updateVideo(
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return await this.videosService.updateVideo(+id, updateVideoDto);
  }
  //동영상 삭제
  @Delete(':id')
  async deleteVideo(@Param('id') id: number) {
    return await this.videosService.deleteVideo(+id);
  }
}
