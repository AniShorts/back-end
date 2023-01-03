import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
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
    return {
      token:this.jwtService.sign(payload)
    }
  }

}