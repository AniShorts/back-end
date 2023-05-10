import { PartialType } from '@nestjs/swagger';
import { CreateCategoryvideoDto } from './create-categoryvideo.dto';

export class UpdateCategoryvideoDto extends PartialType(CreateCategoryvideoDto) {}
