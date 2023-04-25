import { Injectable, } from '@nestjs/common';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatting } from './entities/chatting.entity';
import { QueryFailedError, Repository, TreeRepositoryUtils } from 'typeorm/index';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChattingsService {
  constructor(
    @InjectRepository(Chatting) private chattingRepository: Repository<Chatting>,
    private readonly usersService: UsersService,
    private readonly authService:AuthService
    ) {
    this.chattingRepository = chattingRepository;
  }


  async create(createChattingDto: CreateChattingDto) {
    return await this.chattingRepository.save({...createChattingDto})
  }

  async verify(token: string):Promise<Users>{
    const userInfo:Users=await this.authService.tokenVerify(token)
    return userInfo;
  }

  async findAll() {
    return await this.chattingRepository.find({
      where:{
        
      }
   })
  }

  async myRoomFindAll(user:number){
    return await this.chattingRepository.find({
      where:{
        owner:user
      }
   })
  }

  async findOne(chatId: number) {
    return await this.chattingRepository.findOne({
      where: {
        chatId:chatId,
      }
    })
  }
  update(chatId: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${chatId} chatting`;
  }

  async remove(chatId: number) {
    return await this.chattingRepository.delete({chatId})
  }

  async updateUsers(chatId:number, users:Object[]){
    await this.chattingRepository.update({chatId},{
      users:users
    })
  }
}
