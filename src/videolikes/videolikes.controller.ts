import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VideolikesService } from './videolikes.service';
import { CreateVideolikeDto } from './dto/create-videolike.dto';
import { UpdateVideolikeDto } from './dto/update-videolike.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('videolikes')
export class VideolikesController {
  constructor(private readonly videolikesService: VideolikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  create(
    @Param('id') id: number,
    @Body() createVideolikeDto: CreateVideolikeDto,
    @Req() req,
  ) {
    createVideolikeDto.userId = req.user.userId;
    createVideolikeDto.videoId = Number(id);
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
  update(
    @Param('id') id: string,
    @Body() updateVideolikeDto: UpdateVideolikeDto,
  ) {
    return this.videolikesService.update(+id, updateVideolikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videolikesService.remove(+id);
  }
}
