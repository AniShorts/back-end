import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request, Response } from 'express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /*
  필요한 메소드
  1. 유저 정보 등록
  2. 유저 정보 삭제
  3. 다중 카테고리 등록
  4. 다중 카테고리 삭제
  5. 유저 정보(유저Id)
  6. 유저 정보(카테고리ID)
   */
  @Post('input')
  async inputUser(@Body() body){
    return await this.categoryService.create(body);
  }

  @Delete('delete')
  async delUser(@Body() body){
    return await this.categoryService.remove(body);
  }

  @Post('muti/input')
  async mutiInputUser(@Body() body){
    //여러개 한번에 생성하는 방법
    return await this.categoryService.create(body);
  }

  @Delete('muti/delete')
  async mutiDelUser(@Body() body){
    //조건에 맞는 리스트 삭제
    return await this.categoryService.remove(body);
  }

  @Get(':userId')
  async findUser(@Param('userId') userId:number){
    return await this.categoryService.findByUserId(userId)
  }

  @Get(':categoryId')
  async findCategory(@Param('categoryId') categoryId:number){
    return await this.categoryService.findByCategoryId(categoryId)
  }
}
