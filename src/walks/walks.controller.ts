import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalksService } from './walks.service';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalkBoardList,WalkBoardGet, WalkInput, Result, WalkUpdate } from './walkAnyType';
//게시판 번호 크기
const pageSize:number=10;

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  //산책 게시판 목록
  // @ApiBody({type:SignupInputType})
  @ApiOperation({ summary: '산책 게시판 목록 API', description: '산책 게시물 목록을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물 목록을 제공받는다',type:WalkBoardList})
  @Get('/list/:pageNum')
  async walkBoardList(@Param('pageNum') pageNum:string,@Req() request,@Res() response:Response) {
    const boardInfo=await this.walksService.boardfindAll(Number(pageNum),pageSize);
    //return: {list, pageNum, pageList}
    return response.status(200).send({
      list:boardInfo.list,
      pageNum:pageNum,
      pageList:boardInfo.pageList
    })
  }

  //산책 게시글
  @ApiOperation({ summary: '산책 게시물 API', description: '산책 게시물을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물을 제공받는다',type:WalkBoardGet})
  @Get(':targetWalkId')
  async readWalkBoard(@Param('targetWalkId') targetWalkId:string) {
    return await this.walksService.findOneByWalkId(Number(targetWalkId));
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
    const createWalkDto:CreateWalkDto=request.body;
    createWalkDto.userId=request.user.userId;
    
    //채팅방 생성
    //채팅방 생성 코드
    createWalkDto.chatId=1//임시코드
    
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
  @Patch(':targetWalkId')
  async editWalkBoard(@Param('targetWalkId') targetWalkId: string,@Req() request,@Res() response:Response) {
    const updateWalkDto:UpdateWalkDto=request.body;
    const userId=request.user.userId
    const walkId:number=Number(targetWalkId);
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
  @Delete(':targetWalkId')
  async deleteWalkBoard(@Param('targetWalkId') targetWalkId: string,@Req() request,@Res() response:Response) {
    const userId=request.user.userId
    const walkId:number=Number(targetWalkId);
    await this.walksService.boardRemove(walkId,userId)
    return response.status(200).send({
      result:true
    })
  }
}
