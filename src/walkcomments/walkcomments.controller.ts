import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalkcommentsService } from './walkcomments.service';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
import { UpdateWalkcommentDto } from './dto/update-walkcomment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { Users } from 'src/users/entities/user.entity';
import { Walk } from 'src/walks/entities/walk.entity';
import { WlakCommentInsert } from './walkcommentsAnyType';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('walkcomments')
export class WalkcommentsController {
  constructor(private readonly walkcommentsService: WalkcommentsService) {}

  @ApiBearerAuth('access-token')
  @ApiBody({type:WlakCommentInsert})
  @ApiOperation({ summary: '산책 댓글 작성 API', description: '산책 댓글을 작성한다.' })
  @ApiResponse({status:200, description: '산책 댓글을 작성한다',type:CreateWalkcommentDto})
  @UseGuards(JwtAuthGuard)
  @Post('/:walkId')
  async create(
    @Req() req: any,
    @Param('walkId') walkId: number,
    @Body() body: { walkComment: string },
  ) {
    const { userId } = req.user;
    const insertDto: CreateWalkcommentDto = {
      ...body,
      user: new Users(userId),
      walk: new Walk(walkId),
    };
    return await this.walkcommentsService.create(insertDto);
  }

  @Get('/:walkId/:pageNum')
  async pageWalkComment(
    @Param('pageNum') pageNum: number,
    @Param('walkId') walkId: number,
  ) {
    const list = await this.walkcommentsService.findAllByWalkId(
      pageNum,
      walkId,
    );
    return { list };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:walkCommentId')
  async editComment(
    @Req() req: any,
    @Param('walkCommentId') walkCommentId: string,
    @Body() updateWalkcommentDto: UpdateWalkcommentDto,
  ) {
    const result: Boolean =
      await this.walkcommentsService.updateByWalkCommentId(
        Number(walkCommentId),
        updateWalkcommentDto,
      );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:walkCommentId')
  async deleteComment(
    @Req() req: any,
    @Param('walkCommentId') walkCommentId: string,
  ) {
    const result: Boolean =
      await this.walkcommentsService.removeByWalkCommentId(
        Number(walkCommentId),
      );
    return result;
  }
}
