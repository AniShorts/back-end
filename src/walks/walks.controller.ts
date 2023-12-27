import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { WalksService } from './walks.service';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { WalkBoardList, WalkInput,WalkOutputType, WalkUpdate } from './walkAnyType';
import { Users } from 'src/users/entities/user.entity';
import { Walk } from './entities/walk.entity';
import { outputBase } from 'src/users/userAnyType';
//게시판 번호 크기

@Controller('walks')
export class WalksController {
  constructor(private readonly walksService: WalksService) {}

  /**
   * 산책 게시판 목록
   * @param pageNum number : 페이지 번호
   * @param response Response : response로 반환
   * @returns response.send(WalkBoardList)
   */
  @ApiOperation({ summary: '산책 게시판 목록 API', description: '산책 게시물 목록을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물 목록을 제공받는다',type:WalkBoardList})
  @Get('/list/:pageNum')
  async walkBoardList(@Param('pageNum') pageNum:number,@Res() response:Response) {
    const boardInfo=await this.walksService.boardfindAll(pageNum);

    return response.status(200).send(new WalkBoardList(true,boardInfo.list[0],pageNum,boardInfo.pageList))
  }

  //기존의 api설계에서는 comment까지 같이 제공하는 것으로 되어있다.
  //하지만 comment에도 수의 제한이 필요하다 만일 이것을 나눠어 관리한다
  //산책 게시글
  /**
   * 산책 게시글 정보
   * @param walkId number : 게시물 고유번호
   * @returns res.send(WalkOutputType)
   */
  @ApiOperation({ summary: '산책 게시물 API', description: '산책 게시물을 제공받는다.' })
  @ApiResponse({status:200, description: '산책 게시물을 제공받는다',type:WalkOutputType})
  @Get(':walkId')
  async readWalkBoard(
    @Param('walkId') walkId:number,
    @Res() res:Response,
  ) {
    const result:Walk= await this.walksService.findOneByWalkId(walkId);
    return res.send(new WalkOutputType(true,result))
  }

  // 수정 및 추가 필요 채팅방 생성 코드 작성 후 추가
  /**
   * 산책 게시판 작성
   * @param body CreateWalkDto : 게시물 작성 파라미터
   * @param req user : 가드 결과물
   * @param response  Response : response로 반환 
   * @returns res.send(WalkOutputType)
   */
  @ApiBearerAuth('access-token')
  @ApiBody({type:WalkInput})
  @ApiOperation({ summary: '산책 게시물 작성 API', description: '산책 게시물을 작성한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 작성한다',type:WalkOutputType})
  @UseGuards(JwtAuthGuard)
  @Post()
  async writeWalkBoard(@Body() body:CreateWalkDto,@Req() req,@Res() response:Response) {
    
    const createWalkDto:CreateWalkDto={
      ...body,
      user:new Users(req.user.userId),
    }
    
    const result:Walk=await this.walksService.createWalkBoard(createWalkDto);

    return response.status(200).send(new WalkOutputType(true,result))
  }

  /**
   * 산책 게시판 수정
   * @param walkId number : 게시물 고유번호 
   * @param updateWalkDto UpdateWalkDto : 업데이트 파라미터
   * @param request user.userId number : 유저 고유번호
   * @param response Response : HTTP 반환값
   * @returns response.send(WalkOutputType)
   */
  @ApiBearerAuth('access-token')
  @ApiBody({type:WalkUpdate})
  @ApiOperation({ summary: '산책 게시물 수정 API', description: '산책 게시물을 수정한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 수정한다.',type:WalkOutputType})
  @UseGuards(JwtAuthGuard)
  @Patch(':walkId')
  async editWalkBoard(@Param('walkId') walkId: number,@Body() updateWalkDto:UpdateWalkDto,@Req() request,@Res() response:Response) {
    const {userId}=request.user
    await this.walksService.update(walkId,userId,updateWalkDto);
    const result=await this.walksService.findOneByWalkId(walkId)
    return response.status(200).send(new WalkOutputType(true,result))
  }

  /**
   * 산책 게시판 삭제
   * @param walkId number : 게시물 고유 번호
   * @param request user.userId number : 유저 고유번호
   * @param response Response : HTTP 반환값
   * @returns response.send(outputBase)
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '산책 게시물 삭제 API', description: '산책 게시물을 삭제한다.' })
  @ApiResponse({status:200, description: '산책 게시물을 삭제한다',type:outputBase})
  @UseGuards(JwtAuthGuard)
  @Delete(':walkId')
  async deleteWalkBoard(@Param('walkId') walkId: number,@Req() request,@Res() response:Response) {
    const {userId}=request.user
    await this.walksService.boardRemove(walkId,userId)
    return response.status(200).send(new outputBase(true))
  }
}
