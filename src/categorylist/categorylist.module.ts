import { Module } from '@nestjs/common';
import { CategorylistService } from './categorylist.service';
import { CategorylistController } from './categorylist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorylist } from './entities/categorylist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categorylist])],
  controllers: [CategorylistController],
  providers: [CategorylistService],
  exports: [CategorylistService],
})
export class CategorylistModule {}
