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

  public async checkCategory(categories: any[]): Promise<void> {
    console.log('categories: ', categories);
    for (const category of categories) {
      await this.create(category);
    }
  }
  async create(category: string) {
    console.log('category:', category);

    const checkCate = await this.categorylistRepository.findOne({
      where: { categoryName: category },
    });
    if (!checkCate) {
      console.log('c', category);

      const newCategory = this.categorylistRepository.create({
        categoryName: category,
      });
      return await this.categorylistRepository.save(newCategory);
    } else {
      return;
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
