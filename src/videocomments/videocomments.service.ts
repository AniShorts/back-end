import { Injectable } from '@nestjs/common';
import { CreateVideocommentDto } from './dto/create-videocomment.dto';
import { UpdateVideocommentDto } from './dto/update-videocomment.dto';

@Injectable()
export class VideocommentsService {
  create(createVideocommentDto: CreateVideocommentDto) {
    return 'This action adds a new videocomment';
  }

  findAll() {
    return `This action returns all videocomments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videocomment`;
  }

  update(id: number, updateVideocommentDto: UpdateVideocommentDto) {
    return `This action updates a #${id} videocomment`;
  }

  remove(id: number) {
    return `This action removes a #${id} videocomment`;
  }
}
