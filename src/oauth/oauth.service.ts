import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { async, lastValueFrom, map } from 'rxjs';
import { Oauth } from './entities/oauth.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { Users } from 'src/users/entities/user.entity';
import { hash } from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(Oauth) private oauthRepository: Repository<Oauth>,
    private configService: ConfigService,
    private http: HttpService,
    private readonly userService: UsersService,
    private dataSource:DataSource,
    private readonly authService:AuthService
    ) {
    this.oauthRepository = oauthRepository;
  }
 
  async snsSignup(dto:SignupDto){
    let userInfo=null;
    switch(dto.vender){
      case "kakao":
        userInfo=await this.getUserInfoKakao(dto.access)
    }

    await this.dataSource.transaction(async(managerEntity)=>{
      const usersRepo=managerEntity.withRepository(this.userService.userRepository);
      const oauthRepo=managerEntity.withRepository(this.oauthRepository);
      //유저정보 들고오기 좀더 수정
      //users
      const createUserDto:CreateUserDto={
        nickname:dto.nickname,
        password:'12345',
        phone:"",
        profileImg:"string",
        vender:dto.vender
      }

      const findOneByNickname=async(nickname:string)=>{
        const userInfo = await usersRepo.findOne({
          where: {
            nickname:nickname,
           }
         })
         return userInfo
      }
      let nickname_check=await findOneByNickname(createUserDto.nickname)

      if(nickname_check!==null){
        throw new HttpException('Exist NickName', HttpStatus.FORBIDDEN);
      }else{
        const hashedPassword = await hash(createUserDto.password, 10);
        createUserDto.password=hashedPassword
        await usersRepo.save({...createUserDto})
      }

      //oauth
      const {userId}=await findOneByNickname(dto.nickname)
      const createOauthDto:CreateOauthDto={
        user:new Users(userId),
        snsId:userInfo.id,
        access:dto.access,
        refresh:dto.refresh,
        vender:dto.vender
      }
      const check_snsId=await oauthRepo.findOne({
        where:{
          vender:dto.vender,
          snsId:userInfo.id
        }
      })
      if(check_snsId){
        throw new HttpException('Exist SNSID', HttpStatus.FORBIDDEN);
      }
      await oauthRepo.save({...createOauthDto})
    })

    return;
  }
  
  async kakaoConnect(res){
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey =this.configService.get<string>('REST_API_KEY')
    const _redirectUrl = this.configService.get<string>('REDIRECT_URI')
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  async Logout(userId:number,vender:string){
    const snsInfo=await this.findOneByUserId(userId,vender);
    let url:string=null;
    let headers=null;
    switch(vender){
      case "kakao":
        url="	https://kapi.kakao.com/v1/user/logout";
        headers={
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':'Bearer '+snsInfo.access
          },
        }
    }
    const {data}=await this.postAxios(url,headers)
    return;
  }

  async postAxios(url: string, headers: any): Promise<any> {
    return  await lastValueFrom(
      this.http.post(url, null, headers).pipe(
        map(resp => {
          return resp
        })
      )
    );
  }
  
  async getUserInfoKakao(token:string){
    const url="https://kapi.kakao.com/v2/user/me"
    const headers={
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization':'Bearer '+token
      },
    }
    const {data}=await this.postAxios(url,headers)
    return data
  }

  async findOneByUserId(userId:number,vender:string){
    const userInfo= await this.oauthRepository.findOne({
      relations: {
        user: true,
      },
      select:{
        id:true,
        snsId:true,
        access:true,
        refresh:true,
        user:{userId:true},
        vender:true
      },
      where: {
        user:{
          userId:userId
        },
        vender:vender
      }
    })
    return userInfo
  }

  async findOneBySNSID(snsId:string,vender:string){
    const result=await this.oauthRepository.findOne({
      relations: {
        user: true,
      },
      select:{
        id:true,
        snsId:true,
        access:true,
        refresh:true,
        user:{userId:true},
        vender:true
      },
      where:{
        vender:vender,
        snsId:snsId
      }
    })
    return result
  }

  async saveSNSAccessToken(access:string, userId:number){
    await this.oauthRepository.update({user:{userId}},{
      access
    })
    return;
  }

  async saveSNSRefreshToken(refresh:string, userId:number){
    await this.oauthRepository.update({user:{userId}},{
      refresh
    })
    return;
  }

  async login(userId:number,vender:string,access:string,refresh:string):Promise<{access:string,refresh:string}>{
    await this.saveSNSAccessToken(access,userId);
    await this.saveSNSRefreshToken(refresh,userId);
    const access_token=await this.authService.createAccessToken({userId:userId});
    const refresh_token=await this.authService.createRefreshToken({userId:userId});
    await this.authService.saveAccessToken(access_token,userId)
    await this.authService.saveRefreshToken(refresh_token,userId)
    return {
      access:access_token,
      refresh:refresh_token
    }
  }

  async unlink(snsInfo:Oauth){
    const url="https://kapi.kakao.com/v1/user/unlink";
    const headers={
      Headers:{ 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':'Bearer '+snsInfo.access
      }
    }
    await this.postAxios(url,headers)
  }

  async disconnect(snsId:string,vender:string){
    await this.dataSource.transaction(async(managerEntity)=>{
      const usersRepo=managerEntity.withRepository(this.userService.userRepository);
      const oauthRepo=managerEntity.withRepository(this.oauthRepository);
      const snsInfo=await oauthRepo.findOne({
        where:{
          vender:vender,
          snsId:snsId
        }
      })
      await oauthRepo.delete({
        id:snsInfo.id
      })
      await usersRepo.delete({
        userId:snsInfo.user.userId
      })
    })
  }

}
