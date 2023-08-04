import { Injectable ,  UnauthorizedException,HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Walk } from './entities/walk.entity';
import { UsersService } from 'src/users/users.service';
import { ChattingsService } from 'src/chattings/chattings.service';
import { Chatting } from 'src/chattings/entities/chatting.entity';
import { CreateChattingDto } from 'src/chattings/dto/create-chatting.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalksService {
  constructor(
    @InjectRepository(Walk) private walkRepository: Repository<Walk>,
    private readonly usersService:UsersService,
    private readonly chatttingService:ChattingsService,
    private dataSource:DataSource,
    private configService:ConfigService,
    ) {
    this.walkRepository = walkRepository;
  }

  //좀더 상세 수정전
  //수정 사항
  //1. 생성 제한
  //4. 상세 유저마다 다르게
  
  /**
   * 게시판 작성
   * @param createWalkDto CreateWalkDto
   * @returns Walk
   */
  async createWalkBoard(createWalkDto: CreateWalkDto):Promise<Walk>{
    let saveData:Walk=null
    await this.dataSource.transaction(async(managerEntity)=>{
      const walkRepo=managerEntity.withRepository(this.walkRepository);
      const chatRepo=managerEntity.withRepository(this.chatttingService.chattingRepository);
      
      //Chat DB에 넣을 오브젝트
      const chattingDto:CreateChattingDto={
        owner:createWalkDto.user.userId,
        curNum:1,
        maxNum:createWalkDto.maxNum
      }
      const chatInfo:Chatting=await chatRepo.save({...chattingDto})

      createWalkDto={
        ...createWalkDto,
        curNum:1,
        date:new Date(),
        chat:new Chatting(chatInfo.chatId)
      }
      
      saveData=await walkRepo.save({...createWalkDto})
    })
    if(saveData===null){
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);  
    }

    return saveData
  }

  /**
   * 게시판 목록 (pagnation적용)
   * @param pageNum number 현재 페이지
   * @returns 
   *  list 현페이지 목록
   *  pageList 보이는 페이지 번호
   */
  async boardfindAll(pageNum:number) {
    const pageSize:number=this.configService.get<number>('WALK_PAGESIZE')
    if(pageNum<=0){
      //에러 코드 수정
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const boardCount:number=await this.walkRepository.count();
    
    const pageLimit:number=Math.floor(boardCount%pageSize===0?boardCount/pageSize:boardCount/pageSize+1);
    if(pageNum>pageLimit){
      pageNum=pageLimit
    }
    
    let pageList:Number[]=[];
    let providePageNum=function(first:number){
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
    }if(pageNum<=pageSize/2){
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
      relations:{
        user:true,
      },
      select:{
        walkId:true,
        user:{
          userId:true
        },
        createAt:true
      },
      skip:pageSize*(pageNum-1),
      take:pageSize
    });
    for(let ele of list[0]){
      ele["userId"]=ele.user.userId;
      delete ele.user
    }
    
    return {
      list,
      pageList
    }
  }

  /**
   * walkID로 게시물검색
   * @param walkId number walk 고유 ID 
   * @returns Walk
   */
  async findOneByWalkId(walkId: number):Promise<Walk> {
    const walkInfo:Walk=await this.walkRepository.findOne({
      where:{
        walkId:walkId
      },
      relations:{
        user:true,
        chat:true,
      },
      select:{
        user:{
          nickname:true,
        },
        chat:{
          chatId:true
        }
      }
    })
    if(walkInfo===null){
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }else{
      return walkInfo
    }
  }

  /**
   * 업데이트
   * @param walkId 
   * @param userId 
   * @param updateWalkDto 
   */
  async update(walkId: number,userId:number, updateWalkDto: UpdateWalkDto){
    const walkInfo=await this.findOneByWalkId(walkId)
    if(walkInfo.user.userId!==userId){
      //에러코드 수정 필요
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    await this.walkRepository.update({walkId},{...updateWalkDto})
  }

  /**
   * 게시물 삭제
   * @param walkId number 게시물 고유 번호
   * @param userId number 유저 고유 번호
   */
  async boardRemove(walkId: number,userId:number) {
    const walkInfo=await this.findOneByWalkId(walkId)
    if(walkInfo.user.userId!==userId){
      //에러코드 수정 필요
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    
    await this.dataSource.transaction(async(managerEntity)=>{
      const walkRepo=managerEntity.withRepository(this.walkRepository);
      const chatRepo=managerEntity.withRepository(this.chatttingService.chattingRepository);

      await chatRepo.delete({chatId:walkInfo.chat.chatId});
      await walkRepo.delete({walkId:walkId});
    })
  }
}
