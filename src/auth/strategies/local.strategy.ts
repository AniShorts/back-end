import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { access } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,) {
  constructor(private authService: AuthService,private config: ConfigService) {
    super({
       usernameField : 'nickname',
      });
  }

  async validate(nickname: string,password:string): Promise<any>  {
    const user = await this.authService.validateUser(nickname, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    try {
      const access_token=await this.authService.createAccessToken({userId:user.userId});
      const refresh_token=await this.authService.createRefreshToken({userId:user.userId});
      await this.authService.saveAccessToken(access_token,user.userId)
      await this.authService.saveRefreshToken(refresh_token,user.userId)
      return {access:access_token,refresh:refresh_token}
    } catch (error) {
      
    }
  }
}