import { Body, Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersService} from '../users/users.service'
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { accessTokenType, allTokenType, emailType, numberType, refreshTokenType } from './auth.AnyType';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  /*
  access토큰이 만료될경우 refresh토큰을 refresh로 refresh token을 받아서 access 토큰을 발급받는다.
  */ 
  /**
   * Access토큰 재생성
   * @param req 
   * @param res 
   * @returns 
   */
  @ApiBody({type:refreshTokenType})
  @ApiOperation({ summary: 'Access토큰 재생성 API', description: 'access토큰 재발급.' })
  @ApiResponse({status:200, description: 'access 토큰 제공.', type: accessTokenType })
  @UseGuards(AuthGuard('refresh'))
  @Post()
  async getAccessToken(@Req() req:any,@Res() res:Response) {
    const access:string=req.users
      return res.send(new accessTokenType(access))
  }

  /**
   * Resfresh토큰 재생성
   * @param body 
   * @returns 
   */
  @ApiBody({type:allTokenType})
  @ApiOperation({ summary: 'Resfresh토큰 재생성 API', description: 'Resfresh토큰 재발급.' })
  @ApiResponse({status:200, description: 'Resfresh토큰 토큰 제공.', type: refreshTokenType })
  @Post('getRefresh')
  async getRefreshToken(@Body() body:{access:string,refresh:string}, @Res() res:Response) {
    const refresh:string=await this.authService.getRefreshToken(body.access,body.refresh)
    return res.send(new refreshTokenType(refresh))
  }


  /**
   * 이메일 전송 api
   * @param body 
   * @param res 
   */
  @ApiBody({type:emailType})
  @ApiOperation({ summary: '인증번호용 이메일 전송API', description: '인증번호를 해당 email로 전송' })
  @ApiResponse({status:200, description: '인증번호용 이메일을 전송한다.', type: numberType })
  @Post('email')
  async sendEmail(@Body() body:any,@Res() res:Response){
    const {email}=body
    const randomNum=await this.authService.sendEmail(email)
    
    return res.send(new numberType(randomNum))
  }
}
