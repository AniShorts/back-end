import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CategorylistService } from './categorylist.service';
import { CreateCategorylistDto } from './dto/create-categorylist.dto';
import { UpdateCategorylistDto } from './dto/update-categorylist.dto';

@Controller('categorylist')
export class CategorylistController {
  constructor(private readonly categorylistService: CategorylistService) {}

  /*
  필요한 메소드
  1. 카테고리 등록
  2. 카테고리 삭제
  3. 카테고리 목록 
  4. 카테고리 수정
   */
  @Get('list')
  async categoryList(){
    return await this.categorylistService.findAll();
  }

  @Post('input')
  async inputCategory(@Body() body){
    return await this.categorylistService.create(body);
  }

  @Delete(':id')
  async delCategory(@Param("id") id:number){
    return await this.categorylistService.remove(id);
  }

  @Patch(':id')
  async editCategory(@Param("id") id:number,@Body() body){
    return await this.categorylistService.update(id,body);
  }

}
