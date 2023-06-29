import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WalkcommentsService } from './walkcomments.service';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
import { UpdateWalkcommentDto } from './dto/update-walkcomment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { Users } from 'src/users/entities/user.entity';
import { Walk } from 'src/walks/entities/walk.entity';


@Controller('walkcomments')
export class WalkcommentsController {
  constructor(private readonly walkcommentsService: WalkcommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("/:walkId")
  async create(@Req() req:Request, @Param("walkId") walkId:number, @Body() body:{walkComment:string}) {
    const {userId}=req.user
    const insertDto:CreateWalkcommentDto={
      ...body,
      user:new Users(userId),
      walk:new Walk(walkId)
    }
    return await this.walkcommentsService.create(insertDto);
  }

  @Get("/:walkId/:pageNum")
  async pageWalkComment(@Param("pageNum") pageNum:number,@Param("walkId")  walkId:number){
    const list= await this.walkcommentsService.findAllByWalkId(pageNum,walkId)
    return {list}
  }
  
  @UseGuards(JwtAuthGuard)  
  @Patch("/:walkCommentId")
  async editComment(@Req() req:Request,@Param("walkCommentId") walkCommentId:number,@Body() updateWalkcommentDto:UpdateWalkcommentDto){
    const result:Boolean=await this.walkcommentsService.updateByWalkCommentId(walkCommentId,updateWalkcommentDto)
    return result
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:walkCommentId")
  async deleteComment(@Req() req:Request,@Param("walkCommentId") walkCommentId:number){
    const result:Boolean=await this.walkcommentsService.removeByWalkCommentId(walkCommentId);
    return result
  }

}
