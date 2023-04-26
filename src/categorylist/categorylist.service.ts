import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategorylistDto } from './dto/create-categorylist.dto';
import { UpdateCategorylistDto } from './dto/update-categorylist.dto';
import { Categorylist } from './entities/categorylist.entity';

@Injectable()
export class CategorylistService {
  constructor(@InjectRepository(Categorylist) private categorylistRepository: Repository<Categorylist>,) {
    this.categorylistRepository = categorylistRepository;
  }
  
  async create(createCategorylistDto: CreateCategorylistDto) {
    return await this.categorylistRepository.save(
      createCategorylistDto
    )
  }

  async findAll():Promise<Categorylist[]> {
    const list= await this.categorylistRepository.find();
    return list
  }

  async update(id: number, category: string) {
    return await this.categorylistRepository.update({id:id},{
      category:category
    })
  }

  async remove(id: number) {
    return await this.categorylistRepository.delete({
      id:id
    })
  }
}
