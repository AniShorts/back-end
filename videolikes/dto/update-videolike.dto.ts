import { PartialType } from '@nestjs/mapped-types';
import { CreateVideolikeDto } from './create-videolike.dto';

export class UpdateVideolikeDto extends PartialType(CreateVideolikeDto) {}
