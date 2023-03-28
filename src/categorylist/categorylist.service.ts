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
  
  create(createCategorylistDto: CreateCategorylistDto) {
    return 'This action adds a new categorylist';
  }

  findAll() {
    return `This action returns all categorylist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categorylist`;
  }

  update(id: number, updateCategorylistDto: UpdateCategorylistDto) {
    return `This action updates a #${id} categorylist`;
  }

  remove(id: number) {
    return `This action removes a #${id} categorylist`;
  }
}
