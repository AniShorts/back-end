import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VideolikesService } from './videolikes.service';
import { CreateVideolikeDto } from './dto/create-videolike.dto';
import { UpdateVideolikeDto } from './dto/update-videolike.dto';

@Controller('videolikes')
export class VideolikesController {
  constructor(private readonly videolikesService: VideolikesService) {}

  @Post()
  create(@Body() createVideolikeDto: CreateVideolikeDto) {
    return this.videolikesService.create(createVideolikeDto);
  }

  @Get()
  findAll() {
    return this.videolikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videolikesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideolikeDto: UpdateVideolikeDto) {
    return this.videolikesService.update(+id, updateVideolikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videolikesService.remove(+id);
  }
}
