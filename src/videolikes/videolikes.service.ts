import { Injectable } from '@nestjs/common';
import { CreateVideolikeDto } from './dto/create-videolike.dto';
import { UpdateVideolikeDto } from './dto/update-videolike.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Videolike } from './entities/videolike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideolikesService {
  constructor(
    @InjectRepository(Videolike)
    private videolikeRepository: Repository<Videolike>,
  ) {}

  async create(createVideolikeDto: CreateVideolikeDto) {
    try {
      const like = this.videolikeRepository.create({
        ...createVideolikeDto,
      });
      return await this.videolikeRepository.save(like);
    } catch (error) {
      console.error('Error creating Videolike:', error);
      throw error;
    }
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
