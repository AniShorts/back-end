import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Req, UseGuards, ConsoleLogger, HttpException, HttpStatus } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { CreateOauthDto } from './dto/create-oauth.dto';
import { UpdateOauthDto } from './dto/update-oauth.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { sensitiveHeaders } from 'http2';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { OauthOutputType, SignupDto, outputBase } from './oauthAnyType.dto';
import { Response } from 'express';
import { type } from 'os';

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

  /**
   * SNS(KAKAO) 로그인
   * @param res redirect > Kakao
   */
  @ApiOperation({ summary: '카카오 로그인 API', description: '카카오DEV OPEN API으로 redirect하여 동의창을 꺼낸다.' })
  @ApiResponse({status:200, description: '카카오 url로 redirect'})
  @Get('kakao/login')
  async kakaoConnect(@Res() res:Response){
    await this.oauthService.kakaoConnect(res);
  }

  /**
   * SNS(Kakao) 로그인(전송)  
   * @param req headers : authorization-Bearer, user : userId
   * @param res success : true
   * @returns 
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'kakao 로그아웃', description: '카카오에서 받은 access토큰을 만료시킨다.' })
  @ApiResponse({status:200, description: '카카오에서 받은 토큰을 만료시킨다.', type:outputBase})
  /**
   * Guards : JwtAuthGuard
   * - req.authorization.Bearer : string;
   * return : req.user
   * - req.user.userId : number 
   */
  @UseGuards(JwtAuthGuard)
  @Get('kakao/logout')
  async kakaoLogout(@Req() req,@Res() res:Response){
    const {userId}=req.user
    await this.oauthService.Logout(userId,"kakao");
    return res.send(new outputBase(true))
  }

  /**
   * SNS로그인(카카오톡) - 토큰 발급
   * @param qs code : kakao에서 보내는 고유코드
   * @param res 
   */  
  @ApiOperation({ 
    summary: 'Kakao 토큰 발급', 
    description: '카카오에서 보내는 요청을 받는 api로 유저의 access, refresh토큰을 발급한다.' 
  })
  @ApiQuery({name:"code",description:"카카오에서 받은 고유 코드가 들어간다."})
  @ApiResponse({status:200, description: '유저의 access, refresh 토큰을 발급한다.'})
  @Get('kakao/redirect')
  async kakaoLoginLogicRedirect(@Query() qs:{code:string}, @Res() res:Response) {
    const _code=qs.code
    // const result= await this.oauthService.kakaoRedirect()
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
        //access 토큰과 refresh토큰을 프론트에게 전달시 보안상의 문제가 생길 수 있다.
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
   * SNS(kakao)회원가입
   * @param body SignupDto
   * @param res send:OauthOutputType
   * @returns res.send()
   */
  @ApiBody({type:SignupDto})
  @ApiOperation({ 
    summary: 'SNS(Kakao)유저 생성 API', 
    description: '중복방지를 위해서 닉네임을 받아서 유저 회원가입을 한다.' 
  })
  @ApiResponse({status:200, description: '유저를 생성한다.', type:OauthOutputType})
  @Post('kakao/signup')
  async signupKakao(@Body() body:SignupDto,@Res() res:Response){
    const result:OauthOutputType=await this.oauthService.snsSignup(body)
    return res.send(result)
  }//회원가입을 시킨후 바로 로그인하는가?

  /**
   * Kakao에서 받은 토큰 리로드
   * @param req 
   * @returns 
   */  
  @ApiBody({type:Object})
  @ApiOperation({ summary: 'Kakao 토큰 재발급', description: 'kakao에서 발급받은 토큰을 재발급한다.' })
  @ApiResponse({status:200, description: '토큰 재발급',schema:{}})
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

  /**
   * kakao 연결끊기 == 서비스 탈퇴
   * @param req 
   * @param snsId 
   * @param referrer_type 
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '서비스 탈퇴', description: 'kakao나 홈페이지에서 회원탈퇴하여 sns 정보를 제거하는 api' })
  @ApiQuery({name:"user_id",description:"kakao에서 보낸 유저의 고유 ID"})
  @ApiQuery({name:"referrer_type",description:"요청 type"})
  @ApiResponse({status:200, description: '유저에 대한 정보를 삭제한다.'})
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
