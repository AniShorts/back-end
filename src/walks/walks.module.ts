import { Module } from '@nestjs/common';
import { WalksService } from './walks.service';
import { WalksController } from './walks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Walk } from './entities/walk.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Walk])
  ],
  controllers: [WalksController],
  exports: [WalksService],
  providers: [WalksService]
})
export class WalksModule {}
