import { Injectable } from '@nestjs/common';
import { CreateVideolikeDto } from './dto/create-videolike.dto';
import { UpdateVideolikeDto } from './dto/update-videolike.dto';

@Injectable()
export class VideolikesService {
  create(createVideolikeDto: CreateVideolikeDto) {
    return 'This action adds a new videolike';
  }

  findAll() {
    return `This action returns all videolikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videolike`;
  }

  update(id: number, updateVideolikeDto: UpdateVideolikeDto) {
    return `This action updates a #${id} videolike`;
  }

  remove(id: number) {
    return `This action removes a #${id} videolike`;
  }
}
