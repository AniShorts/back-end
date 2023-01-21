import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalksService } from './walks.service';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Request, Response } from 'express';

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  //산책 게시판 목록
  @Get('/list')
  async walkBoardList(@Req() request:Request,@Res() response:Response) {
    const list=await this.walksService.boardfindAll();
    return response.status(200).send({
      list
    })
  }

  //산책 게시글
  @Get(':id')
  async readWalkBoard(@Param('id') id:string) {
    return await this.walksService.findOneByWalkId(Number(id));
  }

  //산책 게시판 작성
  @Post()
  async writeWalkBoard(@Req() request:Request,@Res() response:Response) {
    const createWalkDto:CreateWalkDto=request.body;
    await this.walksService.create(createWalkDto);
    return response.status(200).send({
      result:true
    })
  }

  //산책 게시판 수정
  @Patch(':id')
  async editWalkBoard(@Param('id') id: string,@Req() request:Request,@Res() response:Response) {
    const updateWalkDto:UpdateWalkDto=request.body;
    const walkId:number=Number(id);
    await this.walksService.update(walkId,updateWalkDto);
    return response.status(200).send({
      result:true
    })
  }

  //산책 게시판 삭제
  @Delete(':id')
  async deleteWalkBoard(@Param('id') id: string,@Req() request:Request,@Res() response:Response) {
    await this.walksService.remove(Number(id))
    return response.status(200).send({
      result:true
    })
  }
}
