import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async send(senderId: string, receiverId: string, content: string, imageUrl?: string) {
    if (!content?.trim() && !imageUrl) throw new Error('Message cannot be empty');

    const message = await this.prisma.message.create({
      data: { senderId, receiverId, content: content?.trim() || '', imageUrl: imageUrl || undefined },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
    return message;
  }

  async getConversations(userId: string) {
    const blockedIds = (await this.prisma.block.findMany({
      where: { blockerId: userId },
      select: { blockedId: true },
    })).map(b => b.blockedId);

    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        NOT: { senderId: { in: blockedIds } },
      },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationMap = new Map<string, {
      user: { id: string; username: string; displayName?: string; avatarUrl?: string };
      lastMessage: { content: string; createdAt: string; senderId: string; imageUrl?: string };
      unreadCount: number;
    }>();

    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (blockedIds.includes(otherUserId)) continue;

      if (!conversationMap.has(otherUserId)) {
        const otherUserData = await this.prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        });
        if (!otherUserData) continue;
        conversationMap.set(otherUserId, {
          user: {
            id: otherUserData.id,
            username: otherUserData.username,
            displayName: otherUserData.displayName || undefined,
            avatarUrl: otherUserData.avatarUrl || undefined,
          },
          lastMessage: { content: msg.content, createdAt: msg.createdAt.toISOString(), senderId: msg.senderId, imageUrl: msg.imageUrl || undefined },
          unreadCount: msg.senderId !== userId && !msg.readAt ? 1 : 0,
        });
      } else {
        const entry = conversationMap.get(otherUserId)!;
        if (msg.senderId !== userId && !msg.readAt) {
          entry.unreadCount++;
        }
      }
    }

    return Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
  }

  async getMessages(userId: string, otherUserId: string) {
    const blocked = await this.prisma.block.findFirst({
      where: { blockerId: userId, blockedId: otherUserId },
    });
    if (blocked) return [];

    await this.prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: userId, readAt: null },
      data: { readAt: new Date() },
    });

    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getUnreadCount(userId: string) {
    const blockedIds = (await this.prisma.block.findMany({
      where: { blockerId: userId },
      select: { blockedId: true },
    })).map(b => b.blockedId);

    return this.prisma.message.count({
      where: { receiverId: userId, readAt: null, senderId: { notIn: blockedIds } },
    });
  }

  async blockUser(blockerId: string, blockedId: string) {
    const existing = await this.prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
    if (existing) return existing;
    return this.prisma.block.create({ data: { blockerId, blockedId } });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    return this.prisma.block.deleteMany({ where: { blockerId, blockedId } });
  }

  async getBlockedUsers(userId: string) {
    const blocks = await this.prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
    return blocks.map(b => b.blocked);
  }

  async reportUser(reporterId: string, reportedId: string, reason?: string) {
    return this.prisma.report.create({
      data: { reporterId, reportedId, reason },
    });
  }
}
