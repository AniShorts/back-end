import { ConflictException, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
const ENV=process.env;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 유저 회원가입 여부 확인
   * @param nickname string : 유저 닉네임
   * @param password string : 유저 비밀번호
   * @returns Users : 해당 유저 정보
   */
  async validateUser(nickname: string, password: string): Promise<Users> {
    //유저 정보 받아오기
    const user:Users = await this.usersService.findOneByNickname(nickname);
    const comparePw:boolean=await compare(password,user.password)
    if (user && comparePw) {
      return user;
    }
    return null;
  }

  /**
   * refresh토큰이 현재의 refresh와 알맞는 토큰인지 확인
   * @param refresh string : refresh 토큰
   * @param userId number : 유저 고유번호
   * @returns boolean : refresh토큰의 확인 결과
   */
  async validateRefresh(refresh:string,userId:number): Promise<boolean> {
    const user=await this.usersService.findOneByUserId(userId)
    if(refresh===user.refresh){
      return true
    }
    return false;
  }

  /**
   * access토큰 생성
   * @param payload object : 토큰에 들어갈 object
   * @returns string : access 토큰
   */
  async createAccessToken(payload:Object){
    return this.jwtService.sign(payload,{
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn:`${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`+'h',
    })
  }

  /**
   * refresh 토큰 생성
   * @param payload object : 토큰에 들어갈 object
   * @returns string : refresh 토큰
   */
  async createRefreshToken(payload:Object){
    return this.jwtService.sign(payload,{
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`+`d`,
    })
  }

  /**
   * refresh 토큰 저장
   * @param token string : refresh 토큰
   * @param userId number : 유저 고유 번호
   */
  async saveRefreshToken(token:string,userId:number){
    await this.usersService.saveRefreshToken(token,userId)
  }

  /**
   * access 토큰 저장
   * @param token string : access 토큰
   * @param userId number : 유저 고유 번호
   */
  async saveAccessToken(token:string,userId:number){
    await this.usersService.saveAccessToken(token,userId)
  }

  /**
   * refresh 토큰 재발급
   * @param access string : access 토큰
   * @param refresh string : refresh 토큰
   * @returns string : refresh 토큰
   */
  async getRefreshToken(access:string, refresh:string): Promise<string>{
    const user=await this.usersService.findOneByToken(access,refresh)
    if(user===null){
      throw new Error('Invalid Access/Refresh Token');
    }
    return await this.createRefreshToken({userId:user.userId})
  }

  /**
   * access 토큰 해체 
   * @param token string : access 토큰
   * @returns Users : 토큰에서 나온 userId로 찾은 유저정보
   */
  async tokenVerify(token:string): Promise<Users> {
    if (!token) {
      throw new Error('No token provided');
    }
    try {
      const {userId} = await this.jwtService.verify(token);
      const userInfo:Users= await this.usersService.findOneByUserId(userId);
      return userInfo
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  /**
   * 인증용 email 전송 service
   * @param userEmail string : 이메일
   * @returns number : 인증번호
   */
  async sendEmail(userEmail:string){
    let randomNum=Math.floor(Math.random()*1000000)
    let randomNum_str:string='';
    for(let i=0;i<6;i++){
      let num_str:string;
      if(randomNum!=0){
        num_str=Math.floor(randomNum%10).toString();
      }else{
        num_str='0'
      }
      randomNum_str=num_str+randomNum_str
      randomNum/=10
    }
    this.mailerService
    .sendMail({
      to: userEmail,
      from: 'noreplay@gmail.com',
      subject: 'AniShorts join msg',
      text: '인증번호입니다.',
      html: '<b>'+randomNum_str+'</b>',
    })
    return randomNum_str
  }


}