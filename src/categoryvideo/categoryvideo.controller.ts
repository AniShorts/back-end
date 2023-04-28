import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryvideoService } from './categoryvideo.service';
import { CreateCategoryvideoDto } from './dto/create-categoryvideo.dto';
import { UpdateCategoryvideoDto } from './dto/update-categoryvideo.dto';

@Controller('categoryvideo')
export class CategoryvideoController {
  constructor(private readonly categoryvideoService: CategoryvideoService) {}

  @Post()
  create(@Body() createCategoryvideoDto: CreateCategoryvideoDto) {
    return this.categoryvideoService.create(createCategoryvideoDto);
  }

  @Get()
  findAll() {
    return this.categoryvideoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryvideoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryvideoDto: UpdateCategoryvideoDto) {
    return this.categoryvideoService.update(+id, updateCategoryvideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryvideoService.remove(+id);
  }
}
