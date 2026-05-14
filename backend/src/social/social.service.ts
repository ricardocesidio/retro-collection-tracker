import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ActivityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('Cannot follow yourself');
    }

    const target = await this.prisma.user.findUnique({ where: { id: followingId } });
    if (!target) throw new NotFoundException('User not found');

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existing) throw new ConflictException('Already following this user');

    const follow = await this.prisma.follow.create({
      data: { followerId, followingId },
    });

    await this.notificationsService.notifyNewFollower(followerId, followingId);

    const follower = await this.prisma.user.findUnique({ where: { id: followerId } });
    await this.prisma.activityLog.create({
      data: {
        userId: followingId,
        type: ActivityType.FOLLOWED_USER,
        message: `${follower?.displayName || follower?.username || 'Someone'} started following you`,
      },
    });

    return follow;
  }

  async unfollow(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (!follow) throw new NotFoundException('Not following this user');

    return this.prisma.follow.delete({ where: { id: follow.id } });
  }

  async getFollowers(userId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: { select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return { data: followers.map((f) => f.follower), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFollowing(userId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: { select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return { data: following.map((f) => f.following), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async isFollowing(followerId: string, followingId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { isFollowing: !!follow };
  }

  async getActivity(userId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.activityLog.count({ where: { userId } }),
    ]);

    return { data: logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
