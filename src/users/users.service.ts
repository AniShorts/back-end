import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(CreateUserDto) private userRepository: Repository<CreateUserDto>,) {
    this.userRepository = userRepository;
  }
  
  async create(user: CreateUserDto):Promise<void> {
    await this.userRepository.save(user)
  }

  findAll(userId:number): Promise<CreateUserDto> {
    return this.userRepository.findOne({
      where: {
        userId:userId,
      }
    })
  }

  async findOne(userId:number): Promise<CreateUserDto> {
    return await this.userRepository.findOne({
      where: {
        userId:userId,
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
