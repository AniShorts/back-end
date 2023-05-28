import { Injectable ,  UnauthorizedException,HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Walk } from './entities/walk.entity';
import { UsersService } from 'src/users/users.service';
import { ChattingsService } from 'src/chattings/chattings.service';
import { Chatting } from 'src/chattings/entities/chatting.entity';
import { CreateChattingDto } from 'src/chattings/dto/create-chatting.dto';

@Injectable()
export class WalksService {
  constructor(
    @InjectRepository(Walk) private walkRepository: Repository<Walk>,
    private readonly usersService:UsersService,
    private readonly chatttingService:ChattingsService) {
    this.walkRepository = walkRepository;
  }

  //좀더 상세 수정전
  //수정 사항
  //1. 생성 제한
  //4. 상세 유저마다 다르게
  
  //게시판 작성
  async createWalkBoard(createWalkDto: CreateWalkDto) {
    const chattingDto:CreateChattingDto={
      curNum:1,
      maxNum:createWalkDto.maxNum
    }
    const chatId=await this.chatttingService.create(chattingDto);
    createWalkDto={
      ...createWalkDto,
      curNum:1,
      date:new Date(),
      chat:new Chatting(chatId)
    }
    await this.walkRepository.save({...createWalkDto})
  }

  //게시판 목록 (pagnation적용)
  async boardfindAll(pageNum:number,pageSize:number) {
    if(pageNum<=0){
      //에러 코드 수정
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const boardCount=await this.walkRepository.count();
    
    const pageLimit:number=boardCount%pageSize===0?boardCount/pageSize:boardCount/pageSize+1

    if(pageNum>pageLimit){
      pageNum=pageLimit
    }
    
    var pageList:Number[]=[];
    var providePageNum=function(first:number){
      for(let i=first;i<first+pageSize;i++){
        pageList.push(i)
      }
    }
    if(boardCount===0){
      providePageNum(1);
      return  {
        list:null,
        pageList:pageList
      }
    }
    if(pageNum<=pageSize/2){
      providePageNum(1);
    }else if(pageNum>pageLimit-pageSize/2){
      providePageNum(pageLimit-pageSize);
    }else{
      providePageNum(pageNum-pageSize/2);
    }

    const list:Object=await this.walkRepository.findAndCount({
      order:{
        walkId:'DESC'
      },
      skip:pageSize*(pageNum-1),
      take:pageSize
    });
    return {
      list,
      pageList
    }

  }

  
  async findOneByWalkId(targetWalkId: number) {
    const walkInfo=await this.walkRepository.findOne({
      where:{
        walkId:targetWalkId
      }
    })
    if(walkInfo===null){
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }else{
      return walkInfo
    }
  }

  async update(walkId: number,userId:number, updateWalkDto: UpdateWalkDto) {
    const walkInfo=await this.findOneByWalkId(walkId)
    if(walkInfo.user.userId!==userId){
      //에러코드 수정 필요
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return await this.walkRepository.update({walkId},{...updateWalkDto})
  }

  async boardRemove(targetWalkId: number,userId:number) {
    const walkInfo=await this.findOneByWalkId(targetWalkId)
    if(walkInfo.userId!==userId){
      //에러코드 수정 필요
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    
    return await this.walkRepository.delete({walkId:targetWalkId})
  }
}
