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
  1. nickname의 중복을 확인하여 insert의 결정한다. > 아닌 경우 에러를 토해낸다.
  2. 비밀번호를 암호화하여 DB에 저장한다.
   */
  async createUser(createUserDto: CreateUserDto):Promise<Object> {
    delete createUserDto.userId;
    let nickname_check=await this.findOneByNickname(createUserDto.nickname)
    if(nickname_check!==null){
      throw new HttpException('Exist NickName', HttpStatus.FORBIDDEN);
    }else{
      const hashedPassword = await hash(createUserDto.password, 10);
      createUserDto.password=hashedPassword
      let user=await this.userRepository.save({...createUserDto})
      return {success:true,result:true};
    }
  }

  //userId를 기준으로 유저정보 제공
  async findOneByUserId(userId:number): Promise<Users> {
      return await this.userRepository.findOne({
        where: {
          userId:userId,
        }
      })
  }
  /*
  변수 nickname을 받아 중복을 확인하는 코드
   */
  async findOneByNickname(nickname:string): Promise<Users> {
    const result=await this.userRepository.findOne({
      where: {
        nickname:nickname,
      }
    })
    return result;
  }

  // //카테고리 업데이트
  // async inputCategory(userId:number,category:object[]){
  //   return await this.userRepository.update({userId},{  
  //     category:category
  //   })
  // }

  //비밀번호 업데이트
  async updatePassword(userId: number,password:string) {
    const hashedPassword = await hash(password, 10);
    return await this.userRepository.update({userId},{  
      password:hashedPassword
    })
  }

  //가입 정보 삭제
  async removeUserByUserId(userId:number) {
    return await this.userRepository.delete({userId})
  }

  async saveRefreshToken(refresh:string, userId:number){
    await this.userRepository.update({userId},{
      refresh
    })
    return;
  }
  async saveAccessToken(access:string, userId:number){
    await this.userRepository.update({userId},{
      access
    })
    return;
  }
}
