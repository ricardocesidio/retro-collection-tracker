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
  async send(@Request() req: any, @Body() body: { receiverId: string; content: string; imageUrl?: string }) {
    return this.messagesService.send(req.user.id, body.receiverId, body.content || '', body.imageUrl);
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

  @Post('block/:userId')
  async blockUser(@Request() req: any, @Param('userId') blockedId: string) {
    return this.messagesService.blockUser(req.user.id, blockedId);
  }

  @Post('unblock/:userId')
  async unblockUser(@Request() req: any, @Param('userId') blockedId: string) {
    return this.messagesService.unblockUser(req.user.id, blockedId);
  }

  @Get('blocked')
  async getBlocked(@Request() req: any) {
    return this.messagesService.getBlockedUsers(req.user.id);
  }

  @Post('report/:userId')
  async reportUser(@Request() req: any, @Param('userId') reportedId: string, @Body() body: { reason?: string }) {
    return this.messagesService.reportUser(req.user.id, reportedId, body.reason);
  }
}
