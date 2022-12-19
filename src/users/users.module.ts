import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Module({
  imports: [TypeOrmModule.forFeature([CreateUserDto])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
