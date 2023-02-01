import { Injectable ,  UnauthorizedException,HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalkDto } from './dto/create-walk.dto';
import { UpdateWalkDto } from './dto/update-walk.dto';
import { Walk } from './entities/walk.entity';

@Injectable()
export class WalksService {
  constructor(@InjectRepository(Walk) private walkRepository: Repository<Walk>,) {
    this.walkRepository = walkRepository;
  }

  //좀더 상세 수정전
  //수정 사항
  //1. 생성 제한
  //4. 상세 유저마다 다르게
  
  async create(createWalkDto: CreateWalkDto) {
    createWalkDto.curNum=1;
    await this.walkRepository.save({...createWalkDto})
  }

  async boardfindAll(pageNum:number,pageSize:number) {

    const pageLimit:number=await this.walkRepository.count()/pageSize;
    const pageList:Object=[];
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
    return await this.walkRepository.findOne({
      where:{
        walkId:targetWalkId
      }
    })
  }

  async update(walkId: number, updateWalkDto: UpdateWalkDto) {
    const walkInfo=await this.findOneByWalkId(walkId)
    if(walkInfo.userId!==updateWalkDto.userId){
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
