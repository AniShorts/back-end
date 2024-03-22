import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategorylistDto } from './dto/create-categorylist.dto';
import { UpdateCategorylistDto } from './dto/update-categorylist.dto';
import { Categorylist } from './entities/categorylist.entity';

@Injectable()
export class CategorylistService {
  constructor(
    @InjectRepository(Categorylist)
    private categorylistRepository: Repository<Categorylist>,
  ) {
    this.categorylistRepository = categorylistRepository;
  }

  public async checkCategory(categories: any[]): Promise<any[]> {
    let categoryIds = [];
    for (const category of categories) {
      categoryIds.push(await this.create(category));
    }
    return categoryIds;
  }

  async create(category: string) {
    console.log('category:', category);

    let checkCate = await this.categorylistRepository.findOne({
      where: { categoryName: category },
    });
    if (!checkCate) {
      const newCategory = this.categorylistRepository.create({
        categoryName: category,
      });
      checkCate = await this.categorylistRepository.save(newCategory);

      return checkCate.categoryId;
    } else {
      return checkCate.categoryId;
    }
  }

  async findAll(): Promise<Categorylist[]> {
    const list = await this.categorylistRepository.find();
    return list;
  }

  /*   async update(id: number, category: string) {
    return await this.categorylistRepository.update(
      { id: id },
      {
        category: category,
      },
    );
  }

  async remove(id: number) {
    return await this.categorylistRepository.delete({
      id: id,
    });
  } */
}
