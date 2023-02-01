import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalksService } from './walks.service';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
const pageSize:number=10;

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  //산책 게시판 목록
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
  @Get(':targetWalkId')
  async readWalkBoard(@Param('targetWalkId') targetWalkId:string) {
    return await this.walksService.findOneByWalkId(Number(targetWalkId));
  }

  //산책 게시판 작성
  @UseGuards(JwtAuthGuard)
  @Post()
  async writeWalkBoard(@Req() request,@Res() response:Response) {
    const createWalkDto:CreateWalkDto=request.body;
    createWalkDto.userId=request.user.userId;
    
    try {
      //채팅방 생성
      //채팅방 생성 코드
      createWalkDto.chatId=1//임시코드
      
      await this.walksService.create(createWalkDto);
  
      return response.status(200).send({
        result:true
      })
    } catch (error) {
      //생성된 채팅방이나 데이터 삭제      
    }
  }

  //산책 게시판 수정
  @UseGuards(JwtAuthGuard)
  @Patch(':targetWalkId')
  async editWalkBoard(@Param('targetWalkId') targetWalkId: string,@Req() request,@Res() response:Response) {
    const updateWalkDto:UpdateWalkDto=request.body;
    updateWalkDto.userId=request.user.userId
    const walkId:number=Number(targetWalkId);
    await this.walksService.update(walkId,updateWalkDto);
    return response.status(200).send({
      result:true
    })
  }

  //산책 게시판 삭제
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
