import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    userId:number;
    nickname:string;
    password:string;
    phone:string;
    category:string[];
    profileImg:string;
}
