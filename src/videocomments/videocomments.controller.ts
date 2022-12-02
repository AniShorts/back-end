import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VideocommentsService } from './videocomments.service';
import { CreateVideocommentDto } from './dto/create-videocomment.dto';
import { UpdateVideocommentDto } from './dto/update-videocomment.dto';

@Controller('videocomments')
export class VideocommentsController {
  constructor(private readonly videocommentsService: VideocommentsService) {}

  @Post()
  create(@Body() createVideocommentDto: CreateVideocommentDto) {
    return this.videocommentsService.create(createVideocommentDto);
  }

  @Get()
  findAll() {
    return this.videocommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videocommentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideocommentDto: UpdateVideocommentDto) {
    return this.videocommentsService.update(+id, updateVideocommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videocommentsService.remove(+id);
  }
}
