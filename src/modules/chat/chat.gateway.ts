import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

type ChatSocket = Socket & {
  user?: {
    _id: string;
    username?: string;
    roles: string;
  };
};

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: ChatSocket) {
    this.logger.log(`socket connecting socketId=${client.id}`);
    try {
      const token = this.extractToken(client);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });

      client.user = {
        _id: payload.sub,
        username: payload.username,
        roles: payload.role,
      };
      client.join(`user:${payload.sub}`);
      this.logger.log(
        `socket authenticated socketId=${client.id} userId=${payload.sub} role=${payload.role}`,
      );
    } catch {
      this.logger.warn(`socket unauthorized socketId=${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: ChatSocket) {
    this.logger.log(
      `socket disconnected socketId=${client.id} userId=${client.user?._id || 'unknown'}`,
    );
  }

  @SubscribeMessage('join_conversation')
  async joinConversation(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    if (!client.user) return { error: 'Unauthorized' };
    this.logger.log(
      `join_conversation start socketId=${client.id} userId=${client.user._id} conversationId=${body.conversationId}`,
    );
    await this.chatService.ensureConversationAccess(client.user, body.conversationId);
    await client.join(`conversation:${body.conversationId}`);
    this.logger.log(
      `join_conversation done socketId=${client.id} userId=${client.user._id} conversationId=${body.conversationId}`,
    );
    return { success: true };
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() body: SendMessageDto,
  ) {
    if (!client.user) return { error: 'Unauthorized' };
    this.logger.log(
      `send_message start socketId=${client.id} userId=${client.user._id} conversationId=${body.conversationId}`,
    );
    const message = await this.chatService.sendMessage(client.user, body);
    this.server.to(`conversation:${body.conversationId}`).emit('message_new', message);
    this.logger.log(
      `send_message done socketId=${client.id} userId=${client.user._id} conversationId=${body.conversationId} messageId=${(message as any)?._id}`,
    );
    return message;
  }

  @SubscribeMessage('mark_read')
  async markRead(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    if (!client.user) return { error: 'Unauthorized' };
    this.logger.log(
      `mark_read userId=${client.user._id} conversationId=${body.conversationId}`,
    );
    const response = await this.chatService.markRead(client.user, body.conversationId);
    this.server.to(`conversation:${body.conversationId}`).emit('message_read', {
      conversationId: body.conversationId,
      userId: client.user._id,
    });
    return response;
  }

  @SubscribeMessage('typing_start')
  async typingStart(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    if (!client.user) return;
    await this.chatService.ensureConversationAccess(client.user, body.conversationId);
    this.logger.log(
      `typing_start userId=${client.user._id} conversationId=${body.conversationId}`,
    );
    client.to(`conversation:${body.conversationId}`).emit('typing', {
      conversationId: body.conversationId,
      userId: client.user._id,
      typing: true,
    });
  }

  @SubscribeMessage('typing_stop')
  async typingStop(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() body: { conversationId: string },
  ) {
    if (!client.user) return;
    await this.chatService.ensureConversationAccess(client.user, body.conversationId);
    this.logger.log(
      `typing_stop userId=${client.user._id} conversationId=${body.conversationId}`,
    );
    client.to(`conversation:${body.conversationId}`).emit('typing', {
      conversationId: body.conversationId,
      userId: client.user._id,
      typing: false,
    });
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (authToken) return authToken;

    const authorization = client.handshake.headers.authorization;
    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice(7);
    }

    return '';
  }
}
