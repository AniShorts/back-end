import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalkcommentsService } from './walkcomments.service';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
import { UpdateWalkcommentDto } from './dto/update-walkcomment.dto';

@Controller('walkcomments')
export class WalkcommentsController {
  constructor(private readonly walkcommentsService: WalkcommentsService) {}

  @Post()
  create(@Body() createWalkcommentDto: CreateWalkcommentDto) {
    return this.walkcommentsService.create(createWalkcommentDto);
  }

  @Get()
  findAll() {
    return this.walkcommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walkcommentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalkcommentDto: UpdateWalkcommentDto) {
    return this.walkcommentsService.update(+id, updateWalkcommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walkcommentsService.remove(+id);
  }
}
