import { PartialType } from '@nestjs/mapped-types';
import { CreateChattingDto } from './create-chatting.dto';

export class UpdateChattingDto extends PartialType(CreateChattingDto) {
  chatId: number;
}
