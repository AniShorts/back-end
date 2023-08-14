import { Injectable,HttpException ,HttpStatus, Delete } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, TreeRepositoryUtils } from 'typeorm/index';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { UsersOutputType } from './userAnyType';

@Injectable()
export class UsersService {
  access_token:string
  constructor(
    @InjectRepository(Users) public userRepository: Repository<Users>,
    private configService: ConfigService,
    private http: HttpService,
    ) {
    this.userRepository = userRepository;
  }
  
  /*
  1. nickname의 중복을 확인하여 insert의 결정한다. > 아닌 경우 에러를 토해낸다.
  2. 비밀번호를 암호화하여 DB에 저장한다.
   */
  async createUser(createUserDto: CreateUserDto):Promise<UsersOutputType> {
    let nickname_check=await this.findOneByNickname(createUserDto.nickname)
    if(nickname_check!==null){
      throw new HttpException('Exist NickName', HttpStatus.FORBIDDEN);
    }else{
      try {
        const hashedPassword = await hash(createUserDto.password, 10);
        createUserDto.password=hashedPassword
        let user=await this.userRepository.save({...createUserDto})
        delete createUserDto.password
        return new UsersOutputType(true,createUserDto)
      } catch (error) {
        return new UsersOutputType(false,createUserDto)
      }
    }
  }
  
  /**
   * sns 가입으로 인한 수정 필요
   * @param userId 
   * @returns
   */
  //userId를 기준으로 유저정보 제공
  async findOneByUserId(userId:number): Promise<Users> {
    const userInfo= await this.userRepository.findOne({
      where: {
        userId:userId,
      }
    })
    return userInfo
  }
  /*
  변수 nickname을 받아 중복을 확인하는 코드
  */
 async findOneByNickname(nickname:string): Promise<Users> {
   const userInfo = await this.userRepository.findOne({
     where: {
       nickname:nickname,
      }
    })
    return userInfo
  }
  
  async findOneByToken(access:string,refresh:string): Promise<Users>{
    const userInfo = await this.userRepository.findOne({
      where:{
        access,
        refresh
      }
    })
    return userInfo
  }
  
  // //카테고리 업데이트
  // async inputCategory(userId:number,category:object[]){
    //   return await this.userRepository.update({userId},{  
      //     category:category
      //   })
      // }
      
    //비밀번호 업데이트
    async updatePassword(userId: number,password:string) {
      const userInfo=await this.findOneByUserId(userId)
      if(userInfo.vender!=="homepage"){
        throw new HttpException('Not Change PW', HttpStatus.FORBIDDEN);
      }
      const hashedPassword = await hash(password, 10);
      await this.userRepository.update({userId},{  
        password:hashedPassword
      })
      return await this.findOneByUserId(userId);
    }
      
    //가입 정보 삭제
    async removeUserByUserId(userId:number) {
      await this.userRepository.delete({userId})
      return await this.findOneByUserId(userId);
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
