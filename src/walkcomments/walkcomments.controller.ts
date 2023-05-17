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

}
