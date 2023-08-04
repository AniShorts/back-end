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
import { Walk } from './entities/walk.entity';
//게시판 번호 크기

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  /**
   * 산책 게시판 목록
   * @param pageNum number : 페이지 번호
   * @param response Response : response로 반환
   * @returns response.send({
   *  walks : 현 페이지 게시물들
   *  pageNum : 현재 페이지 번호
   *  pageList : 보여야할 페이지 목록
   * })
   */
  @ApiOperation({ summary: '산책 게시판 목록 API', description: '산책 게시물 목록을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물 목록을 제공받는다',type:WalkBoardList})
  @Get('/list/:pageNum')
  async walkBoardList(@Param('pageNum') pageNum:number,@Res() response:Response) {
    const boardInfo=await this.walksService.boardfindAll(pageNum);
    //return: {list, pageNum, pageList}
    return response.status(200).send({
      walks:boardInfo.list[0],
      pageNum:pageNum,
      pageList:boardInfo.pageList
    })
  }

  //기존의 api설계에서는 comment까지 같이 제공하는 것으로 되어있다.
  //하지만 comment에도 수의 제한이 필요하다 만일 이것을 나눠어 관리한다
  //산책 게시글
  /**
   * 산책 게시글 정보
   * @param walkId number : 게시물 고유번호
   * @returns res.send({
   *  walkId : 고유 번호
   *  walkTitle : 제목
   *  walkContent : 내용
   *  location : 약속 위치
   *  createAt : 작성 날짜
   *  user : 작성자 유저 정보
   *  maxNum : 최대 참여 인원
   *  curNum : 현재 참여 인원
   * })
   */
  @ApiOperation({ summary: '산책 게시물 API', description: '산책 게시물을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물을 제공받는다',type:WalkBoardGet})
  @Get(':walkId')
  async readWalkBoard(
    @Param('walkId') walkId:number,
    @Res() res:Response,
  ) {
    const result:Walk= await this.walksService.findOneByWalkId(walkId);
    return res.send({
      ...result
    })
  }

  // 수정 및 추가 필요 채팅방 생성 코드 작성 후 추가
  /**
   * 산책 게시판 작성
   * @param body CreateWalkDto : 게시물 작성 파라미터
   * @param req user : 가드 결과물
   * @param response  Response : response로 반환 
   * @returns res.send({
   *  success : 성공여부
   *  result : 결과
   * })
   */
  @ApiBearerAuth('access-token')
  @ApiBody({type:WalkInput})
  @ApiOperation({ summary: '산책 게시물 작성 API', description: '산책 게시물을 작성한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 작성한다',type:Result})
  @UseGuards(JwtAuthGuard)
  @Post()
  async writeWalkBoard(@Body() body:CreateWalkDto,@Req() req,@Res() response:Response) {
    
    const createWalkDto:CreateWalkDto={
      ...body,
      user:new Users(req.user.userId),
    }
    
    const result=await this.walksService.createWalkBoard(createWalkDto);

    return response.status(200).send({
      success:true,
      result
    })
  }

  /**
   * 산책 게시판 수정
   * @param walkId number : 게시물 고유번호 
   * @param updateWalkDto UpdateWalkDto : 업데이트 파라미터
   * @param request user.userId number : 유저 고유번호
   * @param response Response : HTTP 반환값
   * @returns response.send({
   *  Walk
   * })
   */
  @ApiBearerAuth('access-token')
  @ApiBody({type:WalkUpdate})
  @ApiOperation({ summary: '산책 게시물 수정 API', description: '산책 게시물을 수정한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 수정한다.',type:Result})
  @UseGuards(JwtAuthGuard)
  @Patch(':walkId')
  async editWalkBoard(@Param('walkId') walkId: number,@Body() updateWalkDto:UpdateWalkDto,@Req() request,@Res() response:Response) {
    const {userId}=request.user
    await this.walksService.update(walkId,userId,updateWalkDto);
    const result=await this.walksService.findOneByWalkId(walkId)
    return response.status(200).send({
      result:result
    })
  }

  /**
   * 산책 게시판 삭제
   * @param walkId number : 게시물 고유 번호
   * @param request user.userId number : 유저 고유번호
   * @param response Response : HTTP 반환값
   * @returns response.send({
   * 
   * })
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '산책 게시물 삭제 API', description: '산책 게시물을 삭제한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 삭제한다',type:Result})
  @UseGuards(JwtAuthGuard)
  @Delete(':walkId')
  async deleteWalkBoard(@Param('walkId') walkId: number,@Req() request,@Res() response:Response) {
    const {userId}=request.user
    await this.walksService.boardRemove(walkId,userId)
    return response.status(200).send({
      result:true
    })
  }
}
