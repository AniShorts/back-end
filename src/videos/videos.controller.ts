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
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { SearchVideoDto } from './dto/search-video.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { Users } from 'src/users/entities/user.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  //동영상 업로드
  @UseGuards(JwtAuthGuard)
  @Post()
  async createVideo(@Req() request, @Body() createVideoDto: CreateVideoDto) {
    createVideoDto.user = new Users(request.user.userId);

    return await this.videosService.createVideo(createVideoDto);
  }

  //전체 동영상
  @Get('')
  async findAllVideos() {
    //랜덤으로 비디오 보여주는 거??
    return await this.videosService.findAllVideos();
  }

  //검색
  @Get('searchByname')
  async searchByName(@Query() searchVideoDto: SearchVideoDto) {
    return await this.videosService.searchByName(searchVideoDto);
  }

  /* @Get('searchBycate')
  async searchByCate(@Query() searchVideoDto: SearchVideoDto) {
    return await this.videosService.searchByCate(searchVideoDto);
  } */

  //동영상 하나
  @Get(':id')
  async findOneVideo(@Param('id') id: number) {
    return await this.videosService.findOneVideo(+id);
  }

  //유저별
  @Get('user/:id')
  async findUsersVideos(@Param('id') id: number) {
    return await this.videosService.findUsersVideos(+id);
  }

  //동영상 업데이트
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateVideo(
    @Param('id') id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return await this.videosService.updateVideo(+id, updateVideoDto);
  }
  //동영상 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteVideo(@Req() request, @Param('id') videoId: number) {
    const { userId } = request.user;
    console.log(userId);
    const video = await this.videosService.findOneVideo(videoId);
    if (userId !== video.user) {
      throw new HttpException(
        'Not same user created video',
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.videosService.deleteVideo(userId, +videoId);
  }
}
