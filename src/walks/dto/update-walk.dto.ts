import { PartialType } from '@nestjs/mapped-types';
import { CreateWalkDto } from './create-walk.dto';

export class UpdateWalkDto extends PartialType(CreateWalkDto) {}
