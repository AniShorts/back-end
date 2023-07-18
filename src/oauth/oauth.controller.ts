import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req, UseGuards, ConsoleLogger, HttpException, HttpStatus } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { sensitiveHeaders } from 'http2';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly configService: ConfigService,
    private readonly authService:AuthService,
    private readonly usersService:UsersService
    ) {}

  //sns test code
  @Get('kakaoLogin')
  getKakaoLoginPage(): string {
    return `
      <div>
        <h1>카카오 로그인</h1>

        <form action="/oauth/kakao/login" method="GET">
          <input type="submit" value="카카오로그인" />
        </form>

        <form action="/oauth/kakao/logout" method="GET">
          <input type="submit" value="카카오로그아웃 및 연결 끊기" />
        </form>
      </div>
    `;
  }
  //SNS로그인(전송)
  //http 유형 및 주소
  @Get('kakao/login')
  async kakaoConnect(@Res() res){
    await this.oauthService.kakaoConnect(res);
  }
  //SNS로그인(전송)
  //http 유형 및 주소
  @UseGuards(JwtAuthGuard)
  @Get('kakao/logout')
  async kakaoLogout(@Req() req,@Res() res){
    const {userId}=req.user
    await this.oauthService.Logout(userId,"kakao");
    return res.send({
      result:true
    })
  }

  //SNS로그인(카카오톡) - 토큰 발급
  //http 유형 및 주소
  @Get('kakao/redirect')
  async kakaoLoginLogicRedirect(@Query() qs, @Res() res) {
    const _code=qs.code
    const _restApiKey = this.configService.get<string>('REST_API_KEY')
    const _redirect_uri = this.configService.get<string>('REDIRECT_URI')
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${_code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    await this.oauthService
      .postAxios(_hostName, _headers)
      .then(async(e) => {
        const sns_access:string=e.data.access_token;
        const sns_refresh:string=e.data.refresh_token;
        const snsInfo=await this.oauthService.getUserInfoKakao(sns_access);
        const userInfo=await this.oauthService.findOneBySNSID(snsInfo.snsId,"kakao")
        //userInfo!==null => 가입된 상태
        //userInfo===null => 가입되지않은 상태
        if(!userInfo){
          return res.json({
            signup_status:false,
            access:sns_access,
            refresh:sns_refresh,
          })
          //=> POST/kakao/signup 으로 요청시 회원가입
        }else{
          const {
            access,
            refresh
          } = await this.oauthService.login(userInfo.user.userId,"kakao",sns_access,sns_refresh)
          return res.json({
            signup_status:true,
            access:access,
            refresh:refresh,
          })
        }
      })
      .catch((err) => {
        console.log(err);
        return res.send('error');
      });
      /**
       * 카카오 로그인 과정
       * 1. front에서 로그인 요청
       * 2. back에서 kakao 인가코드 요청
       * 3. kakao에서 redirect로 back으로 다시 요청
       * 4. back에서 2번에서 구한 인가코드로 kakao로 다시 인증하여 access, refresh 토큰을 front로 다시 전송
       */
  }  

  /**
   * @param req:SignupDto
   * SignupDto={
   *  access:string;
   *  refresh:string;
   *  nickname:string;
   *  vender:string;
   * }
   */
  @Post('kakao/signup')
  async signupKakao(@Req() req:SignupDto){
    await this.oauthService.snsSignup(req)
  }


  @Get('kakao/reload/access')
  async accessReload(@Req()req:any){
    const _restApiKey = this.configService.get<string>('REST_API_KEY');
    const _refreshToken = req.refresh_token
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=refresh_token&client_id=${_restApiKey}&refresh_token=${_refreshToken}`;
    const _headers = {
      headers: {
        'Content-Type': 'Content-type: application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    return await this.oauthService
      .postAxios(_hostName,_headers)
  }

  @Get('kakao/disconnect')
  async kakaoDisConnect(@Req() req:any,@Query("user_id")snsId:string,@Query("referrer_type") referrer_type:string ){
    // console.log(req.headers.authorization)
    const token_type=req.headers.authorization.split(' ')[0]
    const token_content=req.headers.authorization.split(' ')[1]
    // curl -v -X "GET" "{authority}?user_id=0&referrer_type=UNLINK_FROM_APPS" \
    // -H 'Authorization: KakaoAK de1eceb607b2d779795c687418a8c947'
    console.log(token_type)
    if(token_type==="KakaoAK" && referrer_type==="UNLINK_FROM_APPS"){
      await this.oauthService.disconnect(snsId,"kakao")
    }else if(token_type==="Bearer"){
      const {userId}=await this.authService.tokenVerify(token_content)
      const snsInfo=await this.oauthService.findOneByUserId(userId,"kakao")
      const userInfo=await this.usersService.findOneByUserId(userId)
      try {
        await this.oauthService.disconnect(snsInfo.snsId,"kakao")
        await this.oauthService.unlink(snsInfo)
      } catch (error) {
        if(!await this.usersService.findOneByUserId(userId)){
          throw new HttpException('Faild Delete', HttpStatus.FORBIDDEN);
        }else{
          const dto:SignupDto={
            ...snsInfo,
            ...userInfo
          }
          await this.oauthService.snsSignup(dto)
          throw new HttpException('Faild DisConnect', HttpStatus.FORBIDDEN);
        }
      }
    }
  }
}
