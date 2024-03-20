import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { lastValueFrom, map } from 'rxjs';
import { Oauth } from './entities/oauth.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-users.dto';
import { Users } from 'src/users/entities/user.entity';
import { hash } from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OauthOutputType, SignupDto } from './oauthAnyType.dto';

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
 
  /**
   * sns 가입처리
   * @param dto SignupDto : 가입에 필요한 파라미터
   * @returns OauthOutputType : 가입처리된 후 유저정보 제공
   */
  async snsSignup(dto:SignupDto):Promise<OauthOutputType>{
    //vender에 따라 유저 정보 GET
    //kakao DTO 기입 필요
    let userInfo=null;
    switch(dto.vender){
      case "kakao":
        userInfo=await this.getUserInfoKakao(dto.access)
    }

    //트랜잭션으로 두 DB(user, oauth)에 저장할때 생기는 문제를 해결한다.
    let result:Users=null;
    await this.dataSource.transaction(async(managerEntity)=>{
      //Users, oauth Repositoy 선언
      const usersRepo:Repository<Users>=managerEntity.withRepository(this.userService.userRepository);
      const oauthRepo:Repository<Oauth>=managerEntity.withRepository(this.oauthRepository);

      //유저정보 들고오기 좀더 수정
      //users
      const createUserDto:CreateUserDto={
        nickname:dto.nickname,
        password:'12345',
        phone:"",
        profileImg:"string",
        vender:dto.vender
      }

      //닉네임 중복확인
      ///유저 닉네임 있는지 DB에 검색 메소드
      const findOneByNickname=async(nickname:string):Promise<Users>=>{
        const userInfo:Users = await usersRepo.findOne({
          where: {
            nickname:nickname,
           }
         })
         return userInfo
      }
      ///닉네임있는지 검색
      let nickname_check:Users=await findOneByNickname(createUserDto.nickname)
      /// true > 비어있지 않으니 오류 도출
      if(nickname_check!==null){
        throw new HttpException('Exist NickName', HttpStatus.FORBIDDEN);
      }
      /// false > 비어 있으므로 진행
      else{
        //비밀번호 암호화
        const hashedPassword:string = await hash(createUserDto.password, 10);
        //Object.password에 다시 저장
        createUserDto.password=hashedPassword
        //Users에 저장
        await usersRepo.save({...createUserDto})
      }

      //oauth
      ///Users에 저장한 유저의 ID을 GET
      result=await findOneByNickname(dto.nickname)
      const {userId}=result
      ///DTO 선언
      const createOauthDto:CreateOauthDto={
        user:new Users(userId),
        snsId:userInfo.id,
        access:dto.access,
        refresh:dto.refresh,
        vender:dto.vender
      }
      ///같은 유저가 있는지 체크
      const check_snsId=await oauthRepo.findOne({
        where:{
          vender:dto.vender,
          snsId:userInfo.id
        }
      })
      ///true > 같은 유저가 있으므로 오류
      if(check_snsId){
        throw new HttpException('Exist SNSID', HttpStatus.FORBIDDEN);
      }
      ///ouath에 저장
      await oauthRepo.save({...createOauthDto})
    })
    
    return new OauthOutputType(true,result);
  }
  
  /**
   * kakao 인증 요청
   * @param res Response : redirect하기 위한 Response
   * @returns Response redirect : 카카오 인증페이지 열기 
   */
  async kakaoConnect(res:Response){
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey =this.configService.get<string>('REST_API_KEY')
    const _redirectUrl = this.configService.get<string>('REDIRECT_URI')
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  /**
   * 현재 가지고 있는 access 토큰 만료
   * @param userId number : 유저 ID
   * @param vender string : sns 타입
   * @returns void
   */
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

  /**
   * axios Post 요청 보내기
   * @param url string  : 요청 보낼 url
   * @param headers any : 요청 보낼 headers
   * @returns any : 요청 결과
   */
  async postAxios(url: string, headers: any): Promise<any> {
    return  await lastValueFrom(
      this.http.post(url, null, headers).pipe(
        map(resp => {
          return resp
        })
      )
    );
  }
  
  /**
   * kakao에서 유저정보 획득
   * @param token string : 카카오에서 받은 access 토큰
   * @returns 요청해서 얻는 유저 정보
   */
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

  /**
   * 유저ID로 Oauth 테이블에 저장된 데이터 가져오기
   * @param userId number : 유저ID
   * @param vender string : sns 타입
   * @returns Oauth : 검색된 결과
   */
  async findOneByUserId(userId:number,vender:string):Promise<Oauth>{
    const userInfo:Oauth= await this.oauthRepository.findOne({
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

  /**
   * SNS 고유ID로 Oauth 테이블에 저장된 데이터 가져오기
   * @param snsId string  : sns 고유 Id
   * @param vender string : SNS 타입
   * @returns Oauth : 검색된 결과
   */
  async findOneBySNSID(snsId:string,vender:string):Promise<Oauth>{
    const result:Oauth=await this.oauthRepository.findOne({
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

  /**
   * Oauth 과정에서 얻는 access 토큰 저장
   * @param access string : access token
   * @param userId number : 유저 ID
   * @returns void
   */
  async saveSNSAccessToken(access:string, userId:number):Promise<void>{
    await this.oauthRepository.update({user:{userId}},{
      access
    })
    return;
  }

  /**
   * Oauth 과정에서 얻는 refresh 토큰 저장
   * @param access string : refresh token
   * @param userId number : 유저 ID
   * @returns void
   */
  async saveSNSRefreshToken(refresh:string, userId:number):Promise<void>{
    await this.oauthRepository.update({user:{userId}},{
      refresh
    })
    return;
  }

  /**
   * 로그인 처리
   * @param userId number   : 유저 ID
   * @param vender string   : SNS 타입
   * @param access string   : access token
   * @param refresh string  : refresh token
   * @returns 
   *  access : string access token,
   *  refresh : string refresh token
   */
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

  /**
   * 홈페이지에서 회원탈퇴할경우 oauth 연결해제
   * @param snsInfo Oauth : 유저 Oauth 정보
   * @returns void
   */
  async unlink(snsInfo:Oauth):Promise<void>{
    const url="https://kapi.kakao.com/v1/user/unlink";
    const headers={
      Headers:{ 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':'Bearer '+snsInfo.access
      }
    }
    await this.postAxios(url,headers)
    return;
  }

  /**
   * DB에서 유저 정보 데이터 삭제
   * @param snsId string  :  sns 고유 ID
   * @param vender string :  sns 타입
   */
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
