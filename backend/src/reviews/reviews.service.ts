import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';
import { NotificationsService } from '../social/notifications.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
    private readonly notifications: NotificationsService,
  ) {}

  async findByGame(gameId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { gameId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { gameId } }),
    ]);

    return {
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        include: { game: { include: { platform: true, genre: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { userId } }),
    ]);

    return {
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(userId: string, dto: CreateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: { userId_gameId: { userId, gameId: dto.gameId } },
    });
    if (existing) throw new ConflictException('You already reviewed this game');

    const review = await this.prisma.review.create({
      data: { ...dto, userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    this.notifications.notifyNewReview(userId, dto.gameId).catch(() => {});
    this.xpService.award(userId, 'ADD_REVIEW').catch(() => {});

    return review;
  }

  async toggleLike(userId: string, reviewId: string) {
    const existing = await this.prisma.reviewLike.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    if (existing) {
      await this.prisma.reviewLike.delete({ where: { id: existing.id } });
      await this.prisma.review.update({
        where: { id: reviewId },
        data: { likes: { decrement: 1 } },
      });
    } else {
      await this.prisma.reviewLike.create({
        data: { userId, reviewId },
      });
      await this.prisma.review.update({
        where: { id: reviewId },
        data: { likes: { increment: 1 } },
      });
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { likes: true },
    });
    return review?.likes ?? 0;
  }

  async update(userId: string, id: string, dto: Partial<CreateReviewDto>) {
    const review = await this.prisma.review.findFirst({
      where: { id, userId },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, userId },
    });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.delete({ where: { id } });
  }

  async addComment(userId: string, reviewId: string, content: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    const comment = await this.prisma.reviewComment.create({
      data: { reviewId, userId, content },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
    });

    this.xpService.award(userId, 'WRITE_COMMENT').catch(() => {});

    return comment;
  }

  async getComments(reviewId: string) {
    return this.prisma.reviewComment.findMany({
      where: { reviewId },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
