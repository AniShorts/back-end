import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,) {
    this.categoryRepository = categoryRepository;
  }
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(createCategoryDto);
  }

  async removeByUserId(userId: number) {
    return await this.categoryRepository.delete({
      userId:userId
    })
    // return `This action removes a #${id} category`;
  }
  
  async detailDelUser(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.delete({
      ...createCategoryDto
    })
  }

  async findByUserId(userId:number):Promise<Category[]>{
    let  list=await this.categoryRepository.find({
      where:{
        userId:userId
      }
    })
    return list
  }
  
  async findCategory(categoryId:number):Promise<Category[]>{
    let  list=await this.categoryRepository.find({
      where:{
        categoryId:categoryId
      }
    })
    return list
  }
}
