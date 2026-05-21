import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { Roles } from '@/decorator/customize';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
@Roles('ADMINS', 'ADMIN', 'BUSINESSMAN', 'CUSTOMER')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  createConversation(@Request() req, @Body() dto: CreateConversationDto) {
    return this.chatService.createOrGetConversation(req.user, dto);
  }

  @Get('conversations')
  getConversations(@Request() req) {
    return this.chatService.getConversations(req.user);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @Request() req,
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    return this.chatService.getMessages(req.user, id, Number(limit) || 30, before);
  }

  @Post('messages')
  sendMessage(@Request() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user, dto);
  }

  @Patch('conversations/:id/read')
  markRead(@Request() req, @Param('id') id: string) {
    return this.chatService.markRead(req.user, id);
  }
}
