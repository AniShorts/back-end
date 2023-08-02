import { Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersService} from '../users/users.service'
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  /*
  access토큰이 만료될경우 refresh토큰을 refresh로 refresh token을 받아서 access 토큰을 발급받는다.
  */ 
  @UseGuards(AuthGuard('refresh'))
  @Post()
  async getAccessToken(@Req() req) {
      return req.user
  }

  @Post('getRefresh')
  async getRefreshToken(@Body() body:{access:string,refresh:string}) {
    return {refresh:await this.authService.getRefreshToken(body.access,body.refresh)}
  }


  /**
   * 이메일 전송 api
   * @param body 
   * @param res 
   */
  @Post('email')
  async sendEmail(@Body() body:any,@Res() res:Response){
    const randomNum=await this.authService.sendEmail('aa')
    
    return res.send({
      number:randomNum
    })
  }
}
