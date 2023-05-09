import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy,'refresh') {
  constructor(private authService: AuthService,private config: ConfigService,private jwt:JwtService) {
    super({
       usernameField : 'refresh',
      });
  }

  async validate(refresh:string): Promise<any>  {
    try {
        const userId=(await this.jwt.verify(refresh,{secret:this.config.get('JWT_REFRESH_TOKEN_SECRET')})).userId
        if(!userId){
            throw new UnauthorizedException();
        }
        const auth = await this.authService.validateRefresh(refresh,userId);
        if (!auth) {
            throw new UnauthorizedException();
        }
        const access_token=await this.authService.createAccessToken({userId:userId});
        await this.authService.saveAccessToken(access_token,userId)
        return {access:access_token}
    } catch (error) {
      
    }
  }
}