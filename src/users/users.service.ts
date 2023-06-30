import { Injectable,HttpException ,HttpStatus } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, TreeRepositoryUtils } from 'typeorm/index';
import { compare, hash } from 'bcrypt';
import {HttpService} from '@nestjs/axios'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private readonly httpService: HttpService,
    private configService: ConfigService
    ) {
    this.userRepository = userRepository;
  }
  
  /*
  1. nickname의 중복을 확인하여 insert의 결정한다. > 아닌 경우 에러를 토해낸다.
  2. 비밀번호를 암호화하여 DB에 저장한다.
   */
  async createUser(createUserDto: CreateUserDto):Promise<Object> {
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
  
  async findOneByToken(access:string,refresh:string): Promise<Users>{
    const user=await this.userRepository.findOne({
      where:{
        access,
        refresh
      }
    })
    return user
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
  
  async kakaoConnect(){
    return this.httpService.get('https://kauth.kakao.com/oauth/authorize?client_id='
    +this.configService.get<string>('REST_API_KEY')
    +'redirect_uri='
    +this.configService.get<string>('REDIRECT_URI')+
    '&response_type=code')
  }

  async kakaoLogin(code:any){
    const kakao_api_url = 'https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id='
    +this.configService.get('KAKAO_CLIENT_ID')
    +'&redirect_url='
    +this.configService.get('REDIRECT_URI')
    +'&code='
    +code;
    return;
  }
}
