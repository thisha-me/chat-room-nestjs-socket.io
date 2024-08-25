import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log('Client connected: ' + client.id);

    this.server.emit('user-joined', {
      message: `User Joined the chat: ${client.id}`,
    });
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected: ' + client.id);

    this.server.emit('user-left', {
      message: `User Left the chat: ${client.id}`,
    });
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    console.log(message);
    const replyMessage = `${client.id}: ${message}`;
    client.broadcast.emit('reply', replyMessage);
  }
}
