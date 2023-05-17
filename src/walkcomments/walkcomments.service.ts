import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalkcommentDto } from './dto/create-walkcomment.dto';
import { UpdateWalkcommentDto } from './dto/update-walkcomment.dto';
import { Walkcomment } from './entities/walkcomment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalkcommentsService {
  constructor(@InjectRepository(Walkcomment) private walkcommentRepository: Repository<Walkcomment>){
    this.walkcommentRepository=walkcommentRepository;
  }
  
  async create(createWalkcommentDto: CreateWalkcommentDto) {
    await this.walkcommentRepository.save({
      ...createWalkcommentDto
    });
    return 'This action adds a new walkcomment';
  }

  async findAllByWalkId(pageNum:number,pageSize:number,walkId:number) {
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
      order:{
        walkCommentId:'DESC'
      },
      skip:pageSize*(pageNum-1),
      take:pageSize,
    })
    return list;
  }

  async updateByWalkCommentId(walkCommentId: number, updateWalkcommentDto: UpdateWalkcommentDto) {
    await this.walkcommentRepository.update({walkCommentId},{
      ...updateWalkcommentDto
    })
    return `This action updates a #${walkCommentId} walkcomment`;
  }

  async removeByWalkCommentId(walkCommentId: number) {
    await this.walkcommentRepository.delete({
      walkCommentId
    })
    return `This action removes a #${walkCommentId} walkcomment`;
  }
}
