import { Module } from '@nestjs/common';
import { WalkcommentsService } from './walkcomments.service';
import { WalkcommentsController } from './walkcomments.controller';
import { Walkcomment } from './entities/walkcomment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Walkcomment])
  ],
  controllers: [WalkcommentsController],
  providers: [WalkcommentsService]
})
export class WalkcommentsModule {}
