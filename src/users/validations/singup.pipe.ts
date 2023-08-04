import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-users.dto';

@Injectable()
export class SingnupValidationPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    let nickname = value.nickname;
    let password = value.password;
    let phone = value.phone;
    const passwordRule=/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    if(!passwordRule.test(password)){
        throw new HttpException('Bad_Password', HttpStatus.FORBIDDEN);
    }
    return value;
  }
}