import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChattingsService } from './chattings.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';

@WebSocketGateway()
export class ChattingsGateway {
  constructor(private readonly chattingsService: ChattingsService) {}

  @SubscribeMessage('createChatting')
  create(@MessageBody() createChattingDto: CreateChattingDto) {
    return this.chattingsService.create(createChattingDto);
  }

  @SubscribeMessage('findAllChattings')
  findAll() {
    return this.chattingsService.findAll();
  }

  @SubscribeMessage('findOneChatting')
  findOne(@MessageBody() id: number) {
    return this.chattingsService.findOne(id);
  }

  @SubscribeMessage('updateChatting')
  update(@MessageBody() updateChattingDto: UpdateChattingDto) {
    return this.chattingsService.update(updateChattingDto.id, updateChattingDto);
  }

  @SubscribeMessage('removeChatting')
  remove(@MessageBody() id: number) {
    return this.chattingsService.remove(id);
  }
}
