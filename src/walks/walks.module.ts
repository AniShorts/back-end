import { Module } from '@nestjs/common';
import { WalksService } from './walks.service';
import { WalksController } from './walks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Walk } from './entities/walk.entity';
import { UsersModule } from 'src/users/users.module';
import { ChattingsModule } from 'src/chattings/chattings.module';
import { ConfigModule } from '@nestjs/config';
import { WalkcommentsModule } from 'src/walkcomments/walkcomments.module';

@Module({
  imports: [
    UsersModule,
    WalkcommentsModule,
    ChattingsModule,
    TypeOrmModule.forFeature([Walk]),
    ConfigModule,
    
  ],
  controllers: [WalksController],
  exports: [WalksService],
  providers: [WalksService]
})
export class WalksModule {}
