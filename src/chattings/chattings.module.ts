import { Module } from '@nestjs/common';
import { ChattingsService } from './chattings.service';
import { ChattingsGateway } from './chattings.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatting } from './entities/chatting.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([Chatting])
  ],
  providers: [ChattingsGateway, ChattingsService, JwtService,],
  exports:[ChattingsService]
})
export class ChattingsModule {}
