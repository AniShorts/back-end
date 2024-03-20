import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req,Res,HttpException, UsePipes, Query,} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-users.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {SignupInputType,outputBase, outputBaseFalse, NicknameInputType, LoginInputType, LoginOutputType,CategoryType, PasswordType, UsersOutputType, UsersOutputTypeFaild} from './userAnyType'
import { Request, Response } from 'express';
import { SingnupValidationPipe } from './validations/singup.pipe';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService
    ) {}

  /**
   * 회원가입
   * @param createUserDto body:SignupInputType
   * @param res send:UsersOutputType
   * @returns res.send()
   */
  @ApiBody({type:SignupInputType})
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  @ApiResponse({status:200, description: '유저를 생성한다.', type: UsersOutputType })
  @UsePipes(SingnupValidationPipe)
  @Post("signup")
  async create(@Body() createUserDto: CreateUserDto,@Res() res:Response) {
      /*
      *Service : createUser
      *- createDto를 DB에 저장함
      *- 닉네임 중복확인함
      *- 비밀번호 암호화(Hash)
      */
      const result:UsersOutputType=await this.usersService.createUser(createUserDto);
      /* 
      * Input
      * -CreateUserDto
      * Return
      * - UsersOutputType
      */

      return res.send(result)
  }

  /**
   * 로그인
   * @param req body:LoginInputType
   * @param res send:LoginOutputType
   * @returns LoginOutputType
   */
  @ApiBody({type:LoginInputType})
  @ApiOperation({ summary: '유저 로그인 API', description: '유저를 로그인한다.' })
  @ApiResponse({status:200, description: '로그인 성공', type: LoginOutputType })
  @ApiResponse({status:200.1, description: '로그인 실패.' })
  /**
   * Guards : LocalAuthGuard
   * - req.nickname : string;
   * - req.password : string;
   * return : req.user
   * - req.user.acceess : string 
   * - req.user.refresh : string
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req,@Res() res:Response) {
    //guard의 결과가 req.user에 있어 변수화
    const user = req.user;
    return res.send(new LoginOutputType(true,user.access,user.refresh));
  }

  /**
   * 가입시 닉네임 중복 확인하는 api
   * @param body body:NicknameInputType
   * @param res send:outputBase
   * @returns outputBase
   */
  @ApiBody({type:NicknameInputType})
  @ApiOperation({ summary: '유저 닉네임 중첩확인 API', description: '유저의 닉네임의 중복을 확인한다..' })
  @ApiResponse({status:200, description: '중복이 아니다..', type: outputBase })
  @ApiResponse({status:200.1, description: '중복이다.', type: outputBaseFalse })
  @Post('checkNickname')
  async checkNickname(@Body() body:{nickname:string},@Res() res:Response){
    //req의 body에서 nickname 변수화
    const {nickname}=body

    /*
    * Service : findOneByNickname
    * - 닉네임으로 DB에서 검색
    */
    let check=await this.usersService.findOneByNickname(nickname);
    /*
    * Input
    * - nickname : string
    * Return
    * - Users
    */

   if(check){
     return res.send(new outputBaseFalse(false))
  }else{
     return res.send(new outputBase(true))
   }
    
  }

  /**
   * ID를 찾아주는 api
   * @param req bpdy:NicknameInputType
   * @param res send:UsersOutputType
   * @returns UsersOutputType
   */
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  @ApiBody({type:NicknameInputType})
  @ApiOperation({ summary: '아이디 찾기 API', description: '아이디 찾는다.' })
  @ApiResponse({status:200, description: '아이디 제공.', type: UsersOutputType })
  @ApiResponse({status:200.1, description: '제공되지 않음.', type: UsersOutputTypeFaild })
  @Post('findId')
  async findID(@Req() req,@Res() res:Response){
    //req의 body에서 nickname 변수화
    const {nickname}=req.body

    /*
    * Service : findOneByNickname
    * - 닉네임으로 DB에서 검색
    */
    let result =await this.usersService.findOneByNickname(nickname);
    /*
    * Input
    * - nickname : string
    * Return
    * - Users
    */

    if(result){
      return res.send(new UsersOutputType(true,result))
    }else{
      return res.send(new UsersOutputType(false,result))
    }
  }

  /**
   * 비밀번호 찾기가 불가능해지면서 변경부분에 변화가 필요하다.
   * 로그인 전에도 사용가능한 메소드로 변경해야한다.
   */
  /**
   * 비밀번호 변경
   * @param req body:PasswordType
   * @param res send:UsersOutputType
   * @returns UsersOutputType
   */
  @ApiBearerAuth('access-token')
  @ApiBody({type:PasswordType})
  @ApiOperation({ summary: '유저 비밀번호 변경 API', description: '유저 비밀번호 변경한다.' })
  @ApiResponse({status:200, description: '비밀번호 변경.', type: UsersOutputType })
  /**
   * Guards : JwtAuthGuard
   * - req.authorization.Bearer : string;
   * return : req.user
   * - req.user.userId : number 
   */
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updatePassword(@Req() req,@Res() res:Response) {
    //guard의 결과가 req.user에 있어 변수화
    const {userId}=req.user
    //req의 body에서 password 변수화
    const {password}=req.body

    /*
    * Service : updatePassword
    * - 해시화된 비밀번호으로 수정 
    */
    const result= await this.usersService.updatePassword(userId,password)
    /*
    * Input
    * - userId : number
    * - password : string
    * Return
    * - Users
     */

    return res.send(new UsersOutputType(true,result))
  }

   /**
   * 마이페이지
   * @returns UsersOutputType
   */
  @ApiBearerAuth('access-token')
   @ApiOperation({ summary: '유저 정보 API', description: '유저를 정보획득.' })
   @ApiResponse({status:200, description: '정보획득 성공', type: UsersOutputType })
  /**
   * Guards : JwtAuthGuard
   * - req.authorization.Bearer : string;
   * return : req.user
   * - req.user.userId : number 
   */
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(@Req() req,@Res() res:Response) {
    const {userId}=req.user
    const info=await this.usersService.findOneByUserId(userId);
    const result={
      nickname:info.nickname,
      phone:info.phone,
      profileImg:info.profileImg,
      vender:info.vender,
  }
    return res.send(new UsersOutputType(true,result))
  }


  /**
   * 회원탈퇴
   * @param req header:authorization-Bearer,user:userId
   * @param res success:outputBase, faild:UsersOutputTypeFaild
   * @returns 
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '유저 삭제 API', description: '유저 정보를 삭제한다.' })
  @ApiResponse({status:200, description: '회원탈퇴', type: outputBase })
  @ApiResponse({status:200.1, description: '회원탈퇴 실패', type: UsersOutputTypeFaild })
  /**
   * Guards : JwtAuthGuard
   * - req.authorization.Bearer : string;
   * return : req.user
   * - req.user.userId : number 
   */
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async remove(@Req() req,@Res() res:Response) {
    //guard의 결과가 req.user에 있어 변수화
    const {userId}=req.user;

    /*
    * Service : removeUserByUserId
    * - userId으로 검색된 아이디 삭제 
    */
    const result=await this.usersService.removeUserByUserId(userId);
    /*
    * Input
    * - userId : number
    * Return
    * - delete`s result
     */
    if(result){
      return res.send(new UsersOutputType(false,result))
    }else{
      return res.send(new outputBase(true))
    }
  }
}