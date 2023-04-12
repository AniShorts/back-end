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
  3. 조건에 맞는 정보 삭제
  4. 유저 정보(유저Id)
  5. 유저 정보(카테고리ID)
   */
  @Post()
  async inputUser(@Body() body){
    return await this.categoryService.create(body);
  }

  @Delete(':userId')
  async delUser(@Param() userId:number){
    return await this.categoryService.removeByUserId(userId);
  }
  
  @Delete()
  async detailDelUser(@Body() body:CreateCategoryDto){
    return await this.categoryService.detailDelUser(body);
  }

  @Get('/userId/:userId')
  async findUser(@Param('userId') userId:number){
    return await this.categoryService.findByUserId(userId)
  }
  @Get('/category/:categoryId')
  async findCategory(@Param('categoryId') categoryId:number){
    return await this.categoryService.findCategory(categoryId)
  }

}
