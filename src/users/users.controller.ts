import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request,Response} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './dto/users.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
    ) {}

  @Post("signup")
  async create(
    @Body('nickname')nickname:string,
    @Body('password')password:string,
    @Body('phone')phone:string,
    @Body('category')category:string[],
    @Body('profileImg')profileImg:string,
    ) {
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

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = req.user;
    // await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
    // res.cookie('Authentication', accessToken, accessOption);
    // res.cookie('Refresh', refreshToken, refreshOption);

    return user;
  }

  @Get('/test/:userId')
  findOne(@Param('userId') userId: number) {
    return this.usersService.findOne(userId);
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
