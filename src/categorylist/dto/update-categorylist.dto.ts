import { PartialType } from '@nestjs/swagger';
import { CreateCategorylistDto } from './create-categorylist.dto';

export class UpdateCategorylistDto extends PartialType(CreateCategorylistDto) {}
