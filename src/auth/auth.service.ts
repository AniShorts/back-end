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

  async validateUser(nickname: string, password: string): Promise<any> {
    //유저 정보 받아오기
    const user = await this.usersService.findOneByNickname(nickname);
    const comparePw=await compare(password,user.password)
    if (user && comparePw) {
      return user;
    }
    return null;
  }
  async validateRefresh(refresh:string,userId:number): Promise<Boolean> {
    const user=await this.usersService.findOneByUserId(userId)
    if(refresh===user.refresh){
      return true
    }
    return false;
  }

  async createAccessToken(payload:Object){
    return this.jwtService.sign(payload,{
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn:`${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`+'h',
    })
  }
  async createRefreshToken(payload:Object){
    return this.jwtService.sign(payload,{
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`+`d`,
    })
  }
  async saveRefreshToken(token:string,userId:number){
    return await this.usersService.saveRefreshToken(token,userId)
  }
  async saveAccessToken(token:string,userId:number){
    return await this.usersService.saveAccessToken(token,userId)
  }

  async getRefreshToken(access:string, refresh:string): Promise<String>{
    const user=await this.usersService.findOneByToken(access,refresh)
    if(user===null){
      throw new Error('Invalid Access/Refresh Token');
    }
    return await this.createRefreshToken({userId:user.userId})
  }

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

  //email 전송 service
  async sendEmail(userEmail:string){
    const randomNum=Math.floor(Math.random()*1000000)
    this.mailerService
    .sendMail({
      to: 'cesdea@naver.com',
      from: 'noreplay@gmail.com',
      subject: 'AniShorts join msg',
      text: '인증번호입니다.',
      html: '<b>'+randomNum+'</b>',
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      new ConflictException(error);
    });
    return randomNum
  }


}