import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request,Response} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './dto/users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
    ) {}

  //회원가입
  @Post("signup")
  @ApiOperation({ summary: '유저 생성 API', description: '유저를 생성한다.' })
  @ApiResponse({status:200, description: '유저를 생성한다.', type: Users })
  async create(@Request() req) {
    const {nickname,password,phone,category,profileImg}=req.body
    const user:Users={
      userId:null,
      nickname:nickname,
      password:password,
      phone:phone,
      category:category,
      profileImg:profileImg
    }
    return await this.usersService.create(user);
  }
  
  //nickname 중복확인
  @Post('checkNickname')
  async checkNickname(@Request() req){
    const {nickname}=req.body
    let result=await this.usersService.findByNickNameOne(nickname);
    //true: 중복되지않음, false: 중복됨
    if(result){
      return {status:200,result:result}
    }
    return {status:400,result:false}
  }

  //아이디 찾기(미구현)
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  @Post('findPW')
  async findID(@Request() req){
    const {nickname}=req.body
    let result =await this.usersService.findByNickNameOne(nickname);
    if(result){
      return {status:200,result:result}
    }
    return {status:400,result:false}
  }

  //비밀번호 찾기(미구현)
  //가드를 사용하여 전화번호 인증 구현(적용 예정)
  @Post('findPW')
  async findPW(@Request() req){
    const {nickname}=req.body
    let result =await this.usersService.findByNickNameOne(nickname);
    if(result){
      return {status:200,result:result}
    }
    return {status:400,result:false}
  }

  //로그인
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = req.user;
    return user;
  }
  
  //카테고리 입력
  @UseGuards(JwtAuthGuard)
  @Post('inputCategoury')
  async inputCategory(@Request() req){
    const {userId}=req.user;
    const {category}=req.body;
    return await this.usersService.inputCategory(userId,category)
  }

  //카테고리 출력
  @UseGuards(JwtAuthGuard)
  @Get('sendCategoury')
  async sendCategory(@Request() req){
    const {userId}=req.user
    const {category}=await this.usersService.findOneByUserId(userId);
    return {category};
  }



  @Patch(':userId')
  update(@Param('userId') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: number) {
    return this.usersService.remove(+userId);
  }
}
