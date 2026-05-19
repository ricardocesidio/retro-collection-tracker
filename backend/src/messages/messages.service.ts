import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async send(senderId: string, receiverId: string, content: string) {
    if (!content || !content.trim()) throw new Error('Message cannot be empty');

    const message = await this.prisma.message.create({
      data: { senderId, receiverId, content: content.trim() },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });
    return message;
  }

  async getConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationMap = new Map<string, {
      user: { id: string; username: string; displayName?: string; avatarUrl?: string };
      lastMessage: { content: string; createdAt: string; senderId: string };
      unreadCount: number;
    }>();

    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      if (!conversationMap.has(otherUserId)) {
        const otherUserData = await this.prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        }) as { id: string; username: string; displayName?: string | null; avatarUrl?: string | null } | null;
        if (!otherUserData) continue;
        conversationMap.set(otherUserId, {
          user: {
            id: otherUserData.id,
            username: otherUserData.username,
            displayName: otherUserData.displayName || undefined,
            avatarUrl: otherUserData.avatarUrl || undefined,
          },
          lastMessage: { content: msg.content, createdAt: msg.createdAt.toISOString(), senderId: msg.senderId },
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
    return this.prisma.message.count({
      where: { receiverId: userId, readAt: null },
    });
  }
}
