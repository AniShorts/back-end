import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
import { UpdateWalkcommentDto } from './dto/update-walkcomment.dto';
import { Walkcomment } from './entities/walkcomment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WalkcommentsService {
  constructor(
    @InjectRepository(Walkcomment) private walkcommentRepository: Repository<Walkcomment>,
    private readonly usersService:UsersService
    ){
    this.walkcommentRepository=walkcommentRepository;
  }
  
  async create(createWalkcommentDto: CreateWalkcommentDto) {
    await this.walkcommentRepository.save({
      ...createWalkcommentDto
    });
    return 'This action adds a new walkcomment';
  }

  async findAllByWalkId(pageNum:number,walkId:number) {
    const pageSize:number=Number(process.env.WALKCOMMENT_PAGESIZE)
    if(pageNum<=0){
      //에러 코드 수정
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const commentCount=await this.walkcommentRepository.countBy({walk:{
      walkId
    }})
    
    const pageLimit:number=commentCount%pageSize===0?commentCount/pageSize:commentCount/pageSize+1

    if(pageNum>pageLimit){
      pageNum=pageLimit
    }
    
    var pageList:Number[]=[];
    var providePageNum=function(first:number){
      for(let i=first;i<first+pageSize;i++){
        pageList.push(i)
      }
    }
    if(commentCount===0){
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

    const list=await this.walkcommentRepository.findAndCount({
      where:{
        walk:{
          walkId
        }
      },
      relations:{
        user:true,
        walk:false
      },
      select:{
        user:{nickname:true},
      },
      order:{
        walkCommentId:'DESC',
      },
      skip:pageSize*(pageNum-1),
      take:pageSize,
    })
    
    for(let ele of list[0]){
      ele["nickname"]=ele.user.nickname
      delete ele["user"]
      delete ele["walkCommentId"]
    }
    return list;
  }

  async updateByWalkCommentId(walkCommentId: number, updateWalkcommentDto: UpdateWalkcommentDto):Promise<Boolean> {
    try {
      const result=await this.walkcommentRepository.update({walkCommentId},{
        ...updateWalkcommentDto
      })
      return true
    } catch (error) {
      return false;
    }
  }

  async removeByWalkCommentId(walkCommentId: number):Promise<Boolean> {
    try {
      await this.walkcommentRepository.delete({
        walkCommentId
      })
      return true;
    } catch (error) {
      return false;
    }
  }
}
