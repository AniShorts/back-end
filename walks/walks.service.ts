import { Injectable } from '@nestjs/common';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';

@Injectable()
export class WalksService {
  create(createWalkDto: CreateWalkDto) {
    return 'This action adds a new walk';
  }

  findAll() {
    return `This action returns all walks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walk`;
  }

  update(id: number, updateWalkDto: UpdateWalkDto) {
    return `This action updates a #${id} walk`;
  }

  remove(id: number) {
    return `This action removes a #${id} walk`;
  }
}
