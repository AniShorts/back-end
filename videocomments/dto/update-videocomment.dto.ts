import { PartialType } from '@nestjs/mapped-types';
import { CreateVideocommentDto } from './create-videocomment.dto';

export class UpdateVideocommentDto extends PartialType(CreateVideocommentDto) {}
