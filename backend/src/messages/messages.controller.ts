import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async send(@Request() req: any, @Body() body: { receiverId: string; content: string }) {
    return this.messagesService.send(req.user.id, body.receiverId, body.content);
  }

  @Get('conversations')
  async getConversations(@Request() req: any) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('conversations/:userId')
  async getMessages(@Request() req: any, @Param('userId') otherUserId: string) {
    return this.messagesService.getMessages(req.user.id, otherUserId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.messagesService.getUnreadCount(req.user.id);
    return { count };
  }
}
