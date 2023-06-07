import { HttpException, HttpStatus, Injectable, } from '@nestjs/common';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatting } from './entities/chatting.entity';
import { QueryFailedError, Repository, TreeRepositoryUtils } from 'typeorm/index';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { elementAt } from 'rxjs';

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
    const chatInfo:Chatting=await this.chattingRepository.save({...createChattingDto},{transaction:true,reload:true})
    
    return chatInfo.chatId;
  }

  async verify(token: string):Promise<Users>{
    const userInfo:Users=await this.authService.tokenVerify(token)
    return userInfo;
  }

  async myRoomFindAll(userId:number){
    return await this.chattingRepository.find(  {
      where:[
        {owner:userId},
      ]
   })
  }

  async findOne(chatId: number) {
    return await this.chattingRepository.findOne({
      where: {
        chatId:chatId,
      }
    })
  }

  async joinUser(chatId:number,userId:number){
    const roomInfo=await this.findOne(chatId);
    if(roomInfo.maxNum<=roomInfo.curNum){
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const exist=await roomInfo.users.findIndex(
      ele=>{
        ele==userId
      }
    )
    if(exist!==-1){
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    roomInfo.users.push(userId)
    return await this.chattingRepository.update(
      {chatId},
      {
        users:roomInfo.users
      }
    )
  }

  async checkUser(chatId:number,userId:number):Promise<void>{
    const roomInfo=await this.findOne(chatId);
    const exist=await roomInfo.users.findIndex(
      ele=>{
        ele===userId
      }
    )
    if(exist!==-1){
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
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
