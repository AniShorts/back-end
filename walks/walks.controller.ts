import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalksService } from './walks.service';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  @Post()
  create(@Body() createWalkDto: CreateWalkDto) {
    return this.walksService.create(createWalkDto);
  }

  @Get()
  findAll() {
    return this.walksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalkDto: UpdateWalkDto) {
    return this.walksService.update(+id, updateWalkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walksService.remove(+id);
  }
}
