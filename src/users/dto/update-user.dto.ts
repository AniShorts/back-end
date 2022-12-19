import { PartialType } from '@nestjs/mapped-types';
import { Users } from './users.dto';

export class UpdateUserDto extends PartialType(Users) {
    userId:number;
    nickname:string;
    password:string;
    phone:string;
    category:string[];
    profileImg:string;
}
