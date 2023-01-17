import { Injectable,HttpException ,HttpStatus } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, TreeRepositoryUtils } from 'typeorm/index';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepository: Repository<Users>,) {
    this.userRepository = userRepository;
  }
  
  /*
  userId를 제외하여 DB users에 insert하는 구문
  1. nickname의 중복을 확인하여 insert의 결정한다.
   */
  async create(createUserDto: CreateUserDto):Promise<Object> {
    delete createUserDto.userId;
    let nickname_check=await this.findByNickNameOne(createUserDto.nickname)
    if(nickname_check){
      throw new HttpException('Exist NickName', HttpStatus.FORBIDDEN);
    }else{
      const hashedPassword = await hash(createUserDto.password, 10);
      createUserDto.password=hashedPassword
      let user=await this.userRepository.save({...createUserDto})
      return {success:true,result:true};
    }
  }

  /*
  변수 nickname을 받아 중복을 확인하는 코드
  중복 삭제(예정)
   */
  async findByNickNameOne(nickname:string):Promise<boolean>{
    let result=await this.findOneByNickname(nickname)
    return result!==null;
  }

  async findOneByUserId(userId:number): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        userId:userId,
      }
    })
  }
  async findOneByNickname(nickname:string): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        nickname:nickname,
      }
    })
  }

  async inputCategory(userId:number,category:object[]){
    return await this.userRepository.update({userId},{  
      category:category
    })
  }

  async update(userId: number,password:string) {
    const hashedPassword = await hash(password, 10);
    return await this.userRepository.update({userId},{  
      password:hashedPassword
    })
  }

  async remove(userId:number) {
    return await this.userRepository.delete({userId})
  }

  async getUserRefreshTokenMatches(refresh:string, userId:number){
    const userInfo:Users=await this.findOneByUserId(userId);
    return;
  }
}
