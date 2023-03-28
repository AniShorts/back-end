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
    return 'This action adds a new category';
  }

  async remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async findByUserId(userId:number){
    return 'test'
  }

  async findByCategoryId(categoryId:number){
    return 'cate'
  }
}
