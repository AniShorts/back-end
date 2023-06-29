import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req,Res,HttpException, UsePipes,} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-users.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {SignupInputType,SignupOutputType,outputBase, outputBaseFalse, NicknameInputType, LoginInputType, LoginOutputType,CategoryType, PasswordType} from './userAnyType'
import { HttpStatus } from '@nestjs/common/enums';
import { resourceLimits } from 'worker_threads';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SingnupValidationPipe } from './validations/singup.pipe';

//nestjs 컨트롤 데코레이터-user
@Controller('users')
//class
export class UsersController {
  //생성자
  constructor(
    //service와 불러오기
    private readonly usersService: UsersService
    ) {}

  //회원가입
  //swagger 데코레이터
  //body의 class type
  @ApiBody({type:SignupInputType})
  //swagger api 코멘트
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200, description: '유저를 생성한다.', type: SignupOutputType })
  @UsePipes(SingnupValidationPipe)
  //http 유형 및 주소
  @Post("signup")
  async create(@Body() createUserDto: CreateUserDto) {
      /*
      *Service : createUser
      *- createDto를 DB에 저장함
      *- 닉네임 중복확인함
      *- 비밀번호 암호화(Hash)
      */
      return await this.usersService.createUser(createUserDto);
      /* 
      * Input
      * -CreateUserDto
      * -- userId     : number;
      * -- nickname   : string;
      * -- password   : string;
      * -- phone      : string;
      * -- profileImg :string;
      * Return
      * - {success:true,result:true} 
      */
  }
  
  //가입시 닉네임 중복 확인하는 api
  //swagger 데코레이터
  //body의 class type
  @ApiBody({type:NicknameInputType})
  //swagger api 코멘트
  @ApiOperation({ summary: '유저 닉네임 중첩확인 API', description: '유저의 닉네임의 중복을 확인한다..' })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200, description: '중복이 아니다..', type: outputBase })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200.1, description: '중복이다.', type: outputBaseFalse })
  //http 유형 및 주소
  @Post('checkNickname')
  async checkNickname(@Req() req){
    //req의 body에서 nickname 변수화
    const {nickname}=req.Body

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
    * -- userId     : number;
    * -- nickname   : string;
    * -- password   : string;
    * -- phone      : string;
    * -- profileImg : string;
    * -- access     : string;
    * -- refresh    : string;
    */
    
    return {result:check==null}
  }

  //swagger 수정필요    
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  //ID를 찾아주는 api
  //swagger 데코레이터
  //body의 class type
  @ApiBody({type:NicknameInputType})
  //swagger api 코멘트
  @ApiOperation({ summary: '아이디 찾기 API', description: '아이디 찾는다.' })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200, description: '아이디 제공.', type: outputBase })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200.1, description: '제공되지 않음.', type: outputBaseFalse })
  //http 유형 및 주소
  @Post('findId')
  async findID(@Req() req){
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
    * -- userId     : number;
    * -- nickname   : string;
    * -- password   : string;
    * -- phone      : string;
    * -- profileImg : string;
    * -- access     : string;
    * -- refresh    : string;
    */

    if(result!==null){
      return {result:result}
    }else{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  //암호화된 비밀번호 찾는것은 불가능하다 그러므로 처단
  //swagger 수정필요
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  //PW를 찾아주는 API
  //swagger 데코레이터
  //body의 class type
  // @ApiBody({type:NicknameInputType})
  // //swagger api 코멘트
  // @ApiOperation({ summary: '비밀번호 찾기 API', description: '비밀번호 찾는다.' })
  // //swagger api 응답 코멘트 및 type
  // @ApiResponse({status:200, description: '비밀번호 제공.', type: outputBase })
  // //swagger api 응답 코멘트 및 type
  // @ApiResponse({status:200.1, description: '제공되지 않음.', type: outputBaseFalse })
  // //http 유형 및 주소
  // @Post('findPW')
  // async findPW(@Req() req){
  //   //req의 body에서 nickname 변수화
  //   const {nickname}=req.body
  //   /*
  //   * Service : findPw
  //   * - 닉네임으로 DB에서 검색하여 암호화를 해제하여 PW제공
  //   */
  //   let result:string =await this.usersService.findPw(nickname);
  //   /*
  //   * Input
  //   * - nickname : string
  //   * Return 
  //   * -- password   : string;
  //    */
  //   if(result!==null){
  //     return {status:200,result:result}
  //   }else{
  //     throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //   }
  // }

  //로그인 - 토큰 발급
  //swagger 데코레이터
  //body의 class type
  @ApiBody({type:LoginInputType})
  //swagger api 코멘트
  @ApiOperation({ summary: '유저 로그인 API', description: '유저를 로그인한다.' })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200, description: '로그인 성공', type: LoginOutputType })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200.1, description: '로그인 실패.' })
  //Guards 실행 데코레이터
  /**
   * Guards : LocalAuthGuard
   * - req.nickname : string;
   * - req.password : string;
   * return : req.user
   * - req.user.acceess : string 
   * -- access token
   * - req.user.refresh : string
   * -- refresh token
   */
  @UseGuards(LocalAuthGuard)
  //http 유형 및 주소
  @Post('login')
  async login(@Req() req) {
    //guard의 결과가 req.user에 있어 변수화
    const user = req.user;
    return user;
  }
  
  /**
   * 비밀번호 찾기가 불가능해지면서 변경부분에 변화가 필요하다.
   * 로그인 전에도 사용가능한 메소드로 변경해야한다.
   */
  //비밀번호 변경
  //swagger에 access token 적용
  @ApiBearerAuth('access-token')
  //swagger 데코레이터
  //body의 class type
  @ApiBody({type:PasswordType})
  //swagger api 코멘트
  @ApiOperation({ summary: '유저 비밀번호 변경 API', description: '유저 비밀번호 변경한다.' })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200, description: '비밀번호 변경.', type: outputBase })
  //Guards 실행 데코레이터
  /**
   * Guards : JwtAuthGuard
   * - req.authorization.Bearer : string;
   * return : req.user
   * - req.user.userId : number 
   */
  @UseGuards(JwtAuthGuard)
  //http 유형 및 주소
  @Patch('')
  async updatePassword(@Req() req) {
    //guard의 결과가 req.user에 있어 변수화
    const {userId}=req.user

    //req의 body에서 password 변수화
    const {password}=req.body

    /*
    * Service : updatePassword
    * - 해시화된 비밀번호으로 수정 
    */
    return await this.usersService.updatePassword(userId,password)
    /*
    * Input
    * - userId : number
    * - password : string
    * Return
    * - update`s result
     */
  }

  //회원탈퇴
  //swagger에 access token 적용
  @ApiBearerAuth('access-token')
  //swagger 데코레이터
  //swagger api 코멘트
  @ApiOperation({ summary: '유저 삭제 API', description: '유저 정보를 삭제한다.' })
  //swagger api 응답 코멘트 및 type
  @ApiResponse({status:200, description: '회원탈퇴', type: outputBase })
  //Guards 실행 데코레이터
  /**
   * Guards : JwtAuthGuard
   * - req.authorization.Bearer : string;
   * return : req.user
   * - req.user.userId : number 
   */
  @UseGuards(JwtAuthGuard)
  //http 유형 및 주소
  @Delete('')
  remove(@Req() req) {
    //guard의 결과가 req.user에 있어 변수화
    const {userId}=req.user;

    /*
    * Service : removeUserByUserId
    * - userId으로 검색된 아이디 삭제 
    */
    return this.usersService.removeUserByUserId(userId);
    /*
    * Input
    * - userId : number
    * Return
    * - delete`s result
     */
  }

  //token test
  @UseGuards(JwtAuthGuard)
  @Get('test')
  test(@Req() req:Request, @Res() res:Response){
    return res.status(200).send({
      test:"test"
    });
  }
}