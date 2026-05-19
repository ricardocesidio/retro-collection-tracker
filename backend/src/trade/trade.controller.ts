import { Controller, Get, Post, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TradeService } from './trade.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trade')
@ApiBearerAuth()
@Controller('trade')
@UseGuards(JwtAuthGuard)
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('request')
  async createRequest(@Request() req: any, @Body() body: { receiverId: string; offeredGameId?: string; wantedGameId?: string; message?: string }) {
    return this.tradeService.createRequest(req.user.id, body.receiverId, body.offeredGameId, body.wantedGameId, body.message);
  }

  @Get('received')
  async getReceived(@Request() req: any) {
    return this.tradeService.getReceivedRequests(req.user.id);
  }

  @Get('sent')
  async getSent(@Request() req: any) {
    return this.tradeService.getSentRequests(req.user.id);
  }

  @Post(':id/accept')
  async acceptTrade(@Request() req: any, @Param('id') id: string) {
    return this.tradeService.respondToRequest(req.user.id, id, 'ACCEPTED');
  }

  @Post(':id/decline')
  async declineTrade(@Request() req: any, @Param('id') id: string) {
    return this.tradeService.respondToRequest(req.user.id, id, 'DECLINED');
  }

  @Post(':id/cancel')
  async cancelTrade(@Request() req: any, @Param('id') id: string) {
    return this.tradeService.cancelRequest(req.user.id, id);
  }

  @Post(':id/shipping')
  async updateShipping(@Request() req: any, @Param('id') id: string, @Body() body: { shippingMethod?: string; senderAddress?: string; shippingNotes?: string }) {
    return this.tradeService.updateShipping(req.user.id, id, body);
  }

  @Post(':id/ship')
  async markAsShipped(@Request() req: any, @Param('id') id: string, @Body() body: { trackingNumber: string }) {
    return this.tradeService.markAsShipped(req.user.id, id, body.trackingNumber);
  }

  @Post(':id/received')
  async markAsReceived(@Request() req: any, @Param('id') id: string) {
    return this.tradeService.markAsReceived(req.user.id, id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.tradeService.getUnreadCount(req.user.id);
    return { count };
  }
}
