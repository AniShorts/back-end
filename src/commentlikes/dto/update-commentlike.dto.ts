import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentlikeDto } from './create-commentlike.dto';

export class UpdateCommentlikeDto extends PartialType(CreateCommentlikeDto) {}
