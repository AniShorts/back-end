import { Injectable } from '@nestjs/common';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
import { UpdateWalkcommentDto } from './dto/update-walkcomment.dto';

@Injectable()
export class WalkcommentsService {
  create(createWalkcommentDto: CreateWalkcommentDto) {
    return 'This action adds a new walkcomment';
  }

  findAll() {
    return `This action returns all walkcomments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walkcomment`;
  }

  update(id: number, updateWalkcommentDto: UpdateWalkcommentDto) {
    return `This action updates a #${id} walkcomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} walkcomment`;
  }
}
