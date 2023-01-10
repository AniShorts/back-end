import { Injectable } from '@nestjs/common';
import { Users } from './dto/users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm/index';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private userRepository: Repository<Users>,) {
    this.userRepository = userRepository;
  }
  
  /*
  userId를 제외하여 DB users에 insert하는 구문
  1. nickname의 중복을 확인하여 insert의 결정한다.
   */
  async create(users: Users):Promise<Object> {
    delete users.userId;
    let nickname_check=await this.findByNickNameOne(users.nickname)
    if(nickname_check){
      return {success:false,error:"Exist NickName"};
    }else{
      const hashedPassword = await hash(users.password, 10);
      users.password=hashedPassword
      let user=await this.userRepository.save({...users})
      return {success:true,result:true};
    }
  }

  /*
  변수 nickname을 받아 중복을 확인하는 코드
   */
  async findByNickNameOne(nickname:string):Promise<boolean>{
    let result=await this.userRepository.findOne({
      where: {
        nickname:nickname,
      }
    })
    return result!==null;
  }

  async findOneByUserId(userId:number): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        userId:userId,
      }
    })
  }
  async findOneByNickname(nickname:string): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        nickname:nickname,
      }
    })
  }

  async inputCategory(userId:number,category:object[]){
    return await this.userRepository.update({userId},{  
      category:category
    })
  }

  // async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
  //   const user = await this.getById(id);

  //   const isRefreshTokenMatching = await compare(
  //     refreshToken,
  //     user.currentHashedRefreshToken,
  //   );

  //   if (isRefreshTokenMatching) {
  //     return user;
  //   }
  // }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
