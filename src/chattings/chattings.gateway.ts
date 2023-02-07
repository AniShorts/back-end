import { WebSocketGateway, SubscribeMessage, MessageBody,WebSocketServer } from '@nestjs/websockets'
import { ChattingsService } from './chattings.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import {Server} from 'socket.io';

@WebSocketGateway(3030,{
  cors: {
    origin: '*',
  },
})
export class ChattingsGateway {
  constructor(private readonly chattingsService: ChattingsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createChatting')
  create(@MessageBody() createChattingDto: CreateChattingDto) {
    return this.chattingsService.create(createChattingDto);
  }

  //emit 데이터 전송 받는 역할할 수 있다.
  @SubscribeMessage('ClientToServer')
  handleMessage(@MessageBody() data) {
    console.log(data)
    this.server.emit('ClientToServer', 'server');
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
