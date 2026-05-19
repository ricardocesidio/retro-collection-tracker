import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TradeService {
  constructor(private readonly prisma: PrismaService) {}

  async createRequest(senderId: string, receiverId: string, offeredGameId?: string, wantedGameId?: string, message?: string) {
    if (senderId === receiverId) throw new ForbiddenException('Cannot trade with yourself');

    const request = await this.prisma.tradeRequest.create({
      data: { senderId, receiverId, offeredGameId, wantedGameId, message },
      include: {
        sender: { select: { id: true, username: true, displayName: true,         avatarUrl: true, location: true } },
        receiver: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        offered: { select: { id: true, title: true, coverImageUrl: true } },
        wanted: { select: { id: true, title: true, coverImageUrl: true } },
      },
    });
    return request;
  }

  async getReceivedRequests(userId: string) {
    return this.prisma.tradeRequest.findMany({
      where: { receiverId: userId },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        offered: { select: { id: true, title: true, coverImageUrl: true } },
        wanted: { select: { id: true, title: true, coverImageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSentRequests(userId: string) {
    return this.prisma.tradeRequest.findMany({
      where: { senderId: userId },
      include: {
        receiver: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        offered: { select: { id: true, title: true, coverImageUrl: true } },
        wanted: { select: { id: true, title: true, coverImageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respondToRequest(userId: string, requestId: string, status: 'ACCEPTED' | 'DECLINED') {
    const request = await this.prisma.tradeRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Trade request not found');
    if (request.receiverId !== userId) throw new ForbiddenException('Not your trade request');
    if (request.status !== 'PENDING') throw new ConflictException('Trade request is no longer pending');

    return this.prisma.tradeRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        offered: { select: { id: true, title: true, coverImageUrl: true } },
        wanted: { select: { id: true, title: true, coverImageUrl: true } },
      },
    });
  }

  async cancelRequest(userId: string, requestId: string) {
    const request = await this.prisma.tradeRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Trade request not found');
    if (request.senderId !== userId) throw new ForbiddenException('Not your trade request');

    return this.prisma.tradeRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });
  }

  async updateShipping(userId: string, requestId: string, data: { shippingMethod?: string; senderAddress?: string; shippingNotes?: string }) {
    const request = await this.prisma.tradeRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Trade request not found');
    if (request.senderId !== userId && request.receiverId !== userId) throw new ForbiddenException('Not your trade');

    const update: any = {};
    const isSender = request.senderId === userId;
    if (data.shippingMethod !== undefined) update.shippingMethod = data.shippingMethod;
    if (data.senderAddress !== undefined) {
      if (isSender) update.senderAddress = data.senderAddress;
      else update.receiverAddress = data.senderAddress;
    }
    if (data.shippingNotes !== undefined) update.shippingNotes = data.shippingNotes;

    return this.prisma.tradeRequest.update({
      where: { id: requestId },
      data: update,
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        receiver: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        offered: { select: { id: true, title: true, coverImageUrl: true } },
        wanted: { select: { id: true, title: true, coverImageUrl: true } },
      },
    });
  }

  async markAsShipped(userId: string, requestId: string, trackingNumber: string) {
    const request = await this.prisma.tradeRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Trade request not found');
    if (request.senderId !== userId) throw new ForbiddenException('Only the sender can mark as shipped');

    return this.prisma.tradeRequest.update({
      where: { id: requestId },
      data: { trackingNumber, status: 'SHIPPED' },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        receiver: { select: { id: true, username: true, displayName: true, avatarUrl: true, location: true } },
        offered: { select: { id: true, title: true, coverImageUrl: true } },
        wanted: { select: { id: true, title: true, coverImageUrl: true } },
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.tradeRequest.count({
      where: { receiverId: userId, status: 'PENDING' },
    });
  }
}
