import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'dgram';
import { MessageBody } from '@nestjs/websockets';
const ENV=process.env;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      )}d`,
    })
  }
  async saveRefreshToken(token:string,userId:number){
    return this.usersService.saveRefreshToken(token,userId)
  }
  async saveAccessToken(token:string,userId:number){
    return this.usersService.saveAccessToken(token,userId)
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
}