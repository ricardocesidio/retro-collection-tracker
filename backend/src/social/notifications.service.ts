import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async getUserNotifications(
    userId: string,
    params: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { recipientId: userId },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { recipientId: userId } }),
    ]);

    return {
      data: notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(userId: string) {
    return {
      count: await this.prisma.notification.count({
        where: { recipientId: userId, isRead: false },
      }),
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notif = await this.prisma.notification.findFirst({
      where: { id: notificationId, recipientId: userId },
    });
    if (!notif) return null;
    const result = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    await this.emitUnreadCount(userId);
    return result;
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
    await this.emitUnreadCount(userId);
    return result;
  }

  async create(data: {
    recipientId: string;
    senderId?: string;
    type: NotificationType;
    title: string;
    body?: string;
    link?: string;
  }) {
    const notification = await this.prisma.notification.create({ data });
    const count = await this.prisma.notification.count({
      where: { recipientId: data.recipientId, isRead: false },
    });
    this.notificationGateway.sendToUser(
      data.recipientId,
      'notification:new',
      notification,
    );
    this.notificationGateway.sendToUser(
      data.recipientId,
      'notification:unread',
      { count },
    );
    return notification;
  }

  private async emitUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    });
    this.notificationGateway.sendToUser(userId, 'notification:unread', {
      count,
    });
  }

  // Auto-create notifications for key events
  async notifyNewFollower(followerId: string, followingId: string) {
    const follower = await this.prisma.user.findUnique({
      where: { id: followerId },
      select: { username: true, displayName: true },
    });
    if (!follower) return;

    await this.create({
      recipientId: followingId,
      senderId: followerId,
      type: NotificationType.NEW_FOLLOWER,
      title: 'New Follower',
      body: `${follower.displayName || follower.username} started following you`,
      link: `/profile/${follower.username}`,
    });
  }

  async notifyNewReview(reviewerId: string, gameId: string) {
    const [reviewer, game] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: reviewerId },
        select: { username: true, displayName: true },
      }),
      this.prisma.game.findUnique({
        where: { id: gameId },
        select: { title: true },
      }),
    ]);
    if (!reviewer || !game) return;

    // Notify followers
    const followers = await this.prisma.follow.findMany({
      where: { followingId: reviewerId },
      select: { followerId: true },
    });

    if (followers.length === 0) return;

    await this.prisma.notification.createMany({
      data: followers.map((f) => ({
        recipientId: f.followerId,
        senderId: reviewerId,
        type: NotificationType.NEW_REVIEW,
        title: 'New Review',
        body: `${reviewer.displayName || reviewer.username} reviewed ${game.title}`,
        link: `/games/${gameId}`,
      })),
    });

    const created = await this.prisma.notification.findMany({
      where: { senderId: reviewerId, type: NotificationType.NEW_REVIEW },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: followers.length,
    });

    for (const notif of created) {
      this.notificationGateway.sendToUser(
        notif.recipientId,
        'notification:new',
        notif,
      );
    }

    for (const f of followers) {
      await this.emitUnreadCount(f.followerId);
    }
  }

  async notifyWishlistAdded(userId: string, gameId: string) {
    const [user, game] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, displayName: true },
      }),
      this.prisma.game.findUnique({
        where: { id: gameId },
        select: { title: true },
      }),
    ]);
    if (!user || !game) return;

    const followers = await this.prisma.follow.findMany({
      where: { followingId: userId },
      select: { followerId: true },
    });

    if (followers.length === 0) return;

    await this.prisma.notification.createMany({
      data: followers.map((f) => ({
        recipientId: f.followerId,
        senderId: userId,
        type: NotificationType.WISHLIST_AVAILABLE,
        title: 'Added to Wishlist',
        body: `${user.displayName || user.username} added ${game.title} to their wishlist`,
        link: `/games/${gameId}`,
      })),
    });

    const created = await this.prisma.notification.findMany({
      where: { senderId: userId, type: NotificationType.WISHLIST_AVAILABLE },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: followers.length,
    });

    for (const notif of created) {
      this.notificationGateway.sendToUser(
        notif.recipientId,
        'notification:new',
        notif,
      );
    }

    for (const f of followers) {
      await this.emitUnreadCount(f.followerId);
    }
  }
}
