import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request,Response,HttpException,} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {SignupInputType,SignupOutputType,outputBase, outputBaseFalse, NicknameInputType, LoginInputType, LoginOutputType,CategoryType, PasswordType} from './AnyType'
import { HttpStatus } from '@nestjs/common/enums';
import { resourceLimits } from 'worker_threads';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
    ) {}

  //회원가입
  @ApiBody({type:SignupInputType})
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  @ApiResponse({status:200, description: '유저를 생성한다.', type: SignupOutputType })
  @Post("signup")
  async create(@Body() createUserDto: CreateUserDto) {
      return await this.usersService.create(createUserDto);
  }
  
  //nickname 중복확인
  @ApiBody({type:NicknameInputType})
  @ApiOperation({ summary: '유저 닉네임 중첩확인 API', description: '유저의 닉네임의 중복을 확인한다..' })
  @ApiResponse({status:200, description: '중복이 아니다..', type: outputBase })
  @ApiResponse({status:200.1, description: '중복이다.', type: outputBaseFalse })
  @Post('checkNickname')
  async checkNickname(@Request() req){
    const {nickname}=req.body
    let result=await this.usersService.findByNickNameOne(nickname);
    //true: 중복되지않음, false: 중복됨
    if(result){
      return {result:result}
    }else{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  //swagger 수정필요    
  //아이디 찾기(미구현)
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  @ApiBody({type:NicknameInputType})
  @ApiOperation({ summary: '아이디 찾기 API', description: '아이디 찾는다.' })
  @ApiResponse({status:200, description: '아이디 제공.', type: outputBase })
  @ApiResponse({status:200.1, description: '제공되지 않음.', type: outputBaseFalse })
  @Post('findPW')
  async findID(@Request() req){
    const {nickname}=req.body
    let result =await this.usersService.findByNickNameOne(nickname);
    if(result){
      return {result:result}
    }else{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  //swagger 수정필요
  //비밀번호 찾기(미구현)
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  @ApiBody({type:NicknameInputType})
  @ApiOperation({ summary: '비밀번호 찾기 API', description: '비밀번호 찾는다.' })
  @ApiResponse({status:200, description: '비밀번호 제공.', type: outputBase })
  @ApiResponse({status:200.1, description: '제공되지 않음.', type: outputBaseFalse })
  @Post('findPW')
  async findPW(@Request() req){
    const {nickname}=req.body
    let result =await this.usersService.findByNickNameOne(nickname);
    if(result){
      return {status:200,result:result}
    }else{
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  //로그인
  @ApiBody({type:LoginInputType})
  @ApiOperation({ summary: '유저 로그인 API', description: '유저를 로그인한다.' })
  @ApiResponse({status:200, description: '로그인 성공', type: LoginOutputType })
  @ApiResponse({status:200.1, description: '로그인 실패.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = req.user;
    return user;
  }
  
  //카테고리 입력
  //응답 수정 필요
  @ApiBody({type:CategoryType})
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '유저 카테고리 입력 API', description: '유저 카테고리 입력한다.' })
  @ApiResponse({status:200, description: '수정 필요', type: SignupOutputType })
  @UseGuards(JwtAuthGuard)
  @Post('inputCategoury')
  async inputCategory(@Request() req){
    const {userId}=req.user;
    const {category}=req.body;
    return await this.usersService.inputCategory(userId,category)
  }

  //카테고리 출력
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '유저 카테고리 출력 API', description: '유저 카테고리 출력한다.' })
  @ApiResponse({status:200, description: '유저 카테고리 제공한다.', type: CategoryType })
  @UseGuards(JwtAuthGuard)
  @Get('sendCategoury')
  async sendCategory(@Request() req){
    const {userId}=req.user
    console.log(userId)
    const {category}=await this.usersService.findOneByUserId(userId);
    return {category};
  }
  
  //비밀번호 변경
  @ApiBearerAuth('access-token')
  @ApiBody({type:PasswordType})
  @ApiOperation({ summary: '유저 비밀번호 변경 API', description: '유저 비밀번호 변경한다.' })
  @ApiResponse({status:200, description: '비밀번호 변경.', type: outputBase })
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updatePassword(@Request() req) {
    const {userId}=req.user
    const {password}=req.body
    return await this.usersService.update(userId,password)
  }

  //회원탈퇴
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '유저 삭제 API', description: '유저 정보를 삭제한다.' })
  @ApiResponse({status:200, description: '회원탈퇴', type: outputBase })
  @UseGuards(JwtAuthGuard)
  @Delete('')
  remove(@Request() req) {
    const {userId}=req.user;
    return this.usersService.remove(userId);
  }
}