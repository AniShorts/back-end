import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('oauth')
export class OauthController {
  constructor(
    private readonly oauthService: OauthService,
    private readonly configService: ConfigService
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
  async kakaoDisConnect(@Req() req,@Res() res){
    const {userId}=req.user
    await this.oauthService.DisConnect(userId,"kakao");
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
        const access:string=e.data.access_token;
        const refresh:string=e.data.refresh_token;
        return res.json({
          access:e.data.access_token,
          refresh:e.data.refresh_token
        })
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
}
