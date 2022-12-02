import { PartialType } from '@nestjs/mapped-types';
import { CreateWalkcommentDto } from './create-walkcomment.dto';

export class UpdateWalkcommentDto extends PartialType(CreateWalkcommentDto) {}
