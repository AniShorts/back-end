import { Injectable } from '@nestjs/common';
import { Users } from './dto/users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm/index';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private createUserRepository: Repository<Users>,) {
    this.createUserRepository = createUserRepository;
  }
  
  /*
  userId를 제외하여 DB users에 insert하는 구문
  1. nickname의 중복을 확인하여 insert의 결정한다.
   */
  async create(users: Users):Promise<Object> {
    delete users.userId;
    let nickname_check=await this.findByNickNameOne(users.nickname)
    if(nickname_check){
      return {success:false,error:"Exist NickName"};
    }else{
      await this.createUserRepository.save({...users})
      return {success:true,};
    }
  }

  /*
  변수 nickname을 받아 중복을 확인하는 코드
   */
  async findByNickNameOne(nickname:string):Promise<boolean>{
    let result=await this.createUserRepository.findOne({
      where: {
        nickname:nickname,
      }
    })
    return result!==null;
  }

  async findOne(userId:number): Promise<Users> {
    return await this.createUserRepository.findOne({
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
