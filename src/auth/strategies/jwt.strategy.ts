import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
const ENV=process.env;


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(configService.get('TOKEN_LOCATION')),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any): Promise<any>  {
    return {userId:payload.userId};
  }
}