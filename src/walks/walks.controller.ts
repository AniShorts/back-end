import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalksService } from './walks.service';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalkBoardList,WalkBoardGet, WalkInput, Result, WalkUpdate } from './walkAnyType';
import { Users } from 'src/users/entities/user.entity';
//게시판 번호 크기

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  //산책 게시판 목록
  // @ApiBody({type:SignupInputType})
  @ApiOperation({ summary: '산책 게시판 목록 API', description: '산책 게시물 목록을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물 목록을 제공받는다',type:WalkBoardList})
  @Get('/list/:pageNum')
  async walkBoardList(@Param('pageNum') pageNum:number,@Req() request,@Res() response:Response) {
    const boardInfo=await this.walksService.boardfindAll(pageNum);
    //return: {list, pageNum, pageList}
    return response.status(200).send({
      list:boardInfo.list,
      pageNum:pageNum,
      pageList:boardInfo.pageList
    })
  }

  //기존의 api설계에서는 comment까지 같이 제공하는 것으로 되어있다.
  //하지만 comment에도 수의 제한이 필요하다 만일 이것을 나눠어 관리한다
  //산책 게시글
  @ApiOperation({ summary: '산책 게시물 API', description: '산책 게시물을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물을 제공받는다',type:WalkBoardGet})
  @Get(':walkId')
  async readWalkBoard(
    @Param('walkId') walkId:number,
  ) {
    return await this.walksService.findOneByWalkId(walkId);
  }

  //산책 게시판 작성
  // 수정 및 추가 필요 채팅방 생성 코드 작성 후 추가
  @ApiBearerAuth('access-token')
  @ApiBody({type:WalkInput})
  @ApiOperation({ summary: '산책 게시물 작성 API', description: '산책 게시물을 작성한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 작성한다',type:Result})
  @UseGuards(JwtAuthGuard)
  @Post()
  async writeWalkBoard(@Req() request,@Res() response:Response) {
    
    const createWalkDto:CreateWalkDto={
      ...request.body,
      user:new Users(request.user.userId),
    }
    
    await this.walksService.createWalkBoard(createWalkDto);

    return response.status(200).send({
      result:true
    })
  }

  //산책 게시판 수정
  @ApiBearerAuth('access-token')
  @ApiBody({type:WalkUpdate})
  @ApiOperation({ summary: '산책 게시물 수정 API', description: '산책 게시물을 수정한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 수정한다.',type:Result})
  @UseGuards(JwtAuthGuard)
  @Patch(':walkId')
  async editWalkBoard(@Param('walkId') walkId: number,@Body() updateWalkDto:UpdateWalkDto,@Req() request,@Res() response:Response) {
    const userId=request.user.userId
    await this.walksService.update(walkId,userId,updateWalkDto);
    return response.status(200).send({
      result:true
    })
  }

  //산책 게시판 삭제
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '산책 게시물 삭제 API', description: '산책 게시물을 삭제한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 삭제한다',type:Result})
  @UseGuards(JwtAuthGuard)
  @Delete(':walkId')
  async deleteWalkBoard(@Param('walkId') walkId: number,@Req() request,@Res() response:Response) {
    const userId=request.user.userId
    await this.walksService.boardRemove(walkId,userId)
    return response.status(200).send({
      result:true
    })
  }
}
