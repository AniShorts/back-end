import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Walk } from './entities/walk.entity';

@Injectable()
export class WalksService {
  constructor(@InjectRepository(Walk) private walkRepository: Repository<Walk>,) {
    this.walkRepository = walkRepository;
  }

  //좀더 상세 수정전
  async create(createWalkDto: CreateWalkDto) {
    await this.walkRepository.save({...createWalkDto})
  }

  async boardfindAll() {
    return await this.walkRepository.find();
  }

  async findOneByWalkId(walkId: number) {
    return await this.walkRepository.findOne({
      where:{
        walkId
      }
    })
  }

  async update(walkId: number, updateWalkDto: UpdateWalkDto) {
    return await this.walkRepository.update({walkId},{...updateWalkDto})
  }

  async remove(walkId: number) {
    return await this.walkRepository.delete({walkId})
  }
}
