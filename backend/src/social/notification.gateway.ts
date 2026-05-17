import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/ws',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token as string);
      const userId = payload.sub;
      if (!userId) {
        client.disconnect();
        return;
      }
      client.data.userId = userId;
      client.join(userId);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(_client: Socket) {}

  sendToUser(userId: string, event: string, data: any) {
    this.server?.to(userId).emit(event, data);
  }
}
