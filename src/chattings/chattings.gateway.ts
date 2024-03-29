import { WebSocketGateway, SubscribeMessage, MessageBody,WebSocketServer, WsResponse, ConnectedSocket } from '@nestjs/websockets'
import { ChattingsService } from './chattings.service';
import { UsersService } from 'src/users/users.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import {Server,Socket} from 'socket.io';
import { Users } from 'src/users/entities/user.entity';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';

@WebSocketGateway(3030,{
  cors: {
    origin: '*',
  },
})
export class ChattingsGateway {
  constructor(
    private readonly chattingsService: ChattingsService,
    ) {}
  @WebSocketServer()
  server:Server;

  //연결시 발생하는 이벤트
  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit('ServerToClient', 'Connect')
  }
  //연결해제시 발생하는 이벤트
  handleDisconnect(@ConnectedSocket() client: Socket) {
    //채팅방 인원 나갈때 제거
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() socket:Socket,@MessageBody() data) {
    const {room,token}=data;

    //get user information 
    const userInfo:Users=await this.chattingsService.verify(token);
    const userName:String=userInfo.nickname;

    //채팅방 최대 인원 체크
    //채팅방 중복 체크
    //채팅방 인원에 기록
    await this.chattingsService.joinUser(room,userInfo.userId)

    socket.join(room);
    socket.to(room).emit('chatToRoom', userName+"님이 "+"들어왔습니다");
  }
  /*
  if(data=='joinRoom'){
      //namespace를 사용하여 room이라는 가입
      socket.join('room')

      //room에 있는 인원에게 이벤트ServerToClient으로 메시지 전송 
      this.server.to('room').emit('chatToRoom',)

      //room에 있는 인원중 자신을 제외한 이벤트ServerToClient으로 메시지 전송
      socket.to('room').emit('ServerToClient', 'hi');
    }else{
      //전체에 메시지 전송
      socket.emit('ServerToClient', 'server');
    }
   */

  //emit 데이터 전송 받는 역할할 수 있다.
  //@ConnectedSocket() 데코레이터가 없을 경우 socket 변수가 제대로 작동되지 않음 주의
  @SubscribeMessage('chatToRoom')
  async handleMessage(@ConnectedSocket() socket:Socket,@MessageBody() data) {
    console.log(data)
    const {room,token,text}=data;

    //토큰받아서 유저인지 확인.
    //get user information 
    const userInfo:Users=await this.chattingsService.verify(token);
    //해당 방에 있는 유저인지 확인
    await this.chattingsService.checkUser(room,userInfo.userId)

    //logger
    this.server.to(room).emit('chatToRoom',text);
  }

  @SubscribeMessage('removeMember')
  async handleExport(@ConnectedSocket() socket:Socket,@MessageBody() data){
    const {user}=data;
    const {room}=data;
    const {target}=data;
    // await this.chattingsService.removeMember()
    let roomInfo=await this.chattingsService.findOne(room);

    //방 주인 확인
    if(!(roomInfo.owner==(user as number))){
      //에러코드 수정
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    //DB의 방 정보에서 유저리스트에서 유저 제거
    const updateUsers=roomInfo.users.filter(ele=>ele!=target)
    await this.chattingsService.updateUsers(room,updateUsers)

    //socket 이벤트로 참가자 내보내기

  }

  //현재 user가 참가하고 있는 룸 리스트
  @SubscribeMessage('myRoomLIst')
  async handleRoomList(@MessageBody() data){
    const {token}=data;
    //get user information 
    const userInfo:Users=await this.chattingsService.verify(token);
    //해당 방에 있는 유저인지 확인
    const roomAllList=await this.chattingsService.myRoomFindAll(userInfo.userId);

    //메시지 보내기 구현

  }

  //방의 정보를 보내는 이벤트
  @SubscribeMessage('roomInfo')
  async handleRoomInfo(@MessageBody() data,@ConnectedSocket() client: Socket){
    const {room,token}=data;
    //get user information 
    const userInfo:Users=await this.chattingsService.verify(token);
    //해당 방에 있는 유저인지 확인
    await this.chattingsService.checkUser(room,userInfo.userId)
    const roomAllList=await this.chattingsService.findOne(room)
    //메시지 보내기 구현
    client.emit('roomInfo',roomAllList)
  }
  //산책-나가기
  //산책-채팅방 이름 바꾸기

}
