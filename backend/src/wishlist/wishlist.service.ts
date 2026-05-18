import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../social/notifications.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getUserWishlist(
    userId: string,
    params: { page?: number; limit?: number },
  ) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.wishlist.findMany({
        where: { userId },
        include: { game: { include: { platform: true, genre: true } } },
        skip,
        take: limit,
        orderBy: [{ priority: 'asc' }, { addedAt: 'desc' }],
      }),
      this.prisma.wishlist.count({ where: { userId } }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async add(userId: string, dto: CreateWishlistDto) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_gameId: { userId, gameId: dto.gameId } },
    });
    if (existing) throw new ConflictException('Game already in wishlist');

    const wishlist = await this.prisma.wishlist.create({
      data: { ...dto, userId },
      include: { game: { include: { platform: true, genre: true } } },
    });

    this.notifications.notifyWishlistAdded(userId, dto.gameId).catch(() => {});

    return wishlist;
  }

  async update(userId: string, id: string, dto: UpdateWishlistDto) {
    const item = await this.prisma.wishlist.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Wishlist entry not found');

    return this.prisma.wishlist.update({
      where: { id },
      data: dto,
      include: { game: { include: { platform: true, genre: true } } },
    });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.wishlist.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Wishlist entry not found');

    return this.prisma.wishlist.delete({ where: { id } });
  }

  async removeByGameId(userId: string, gameId: string) {
    const item = await this.prisma.wishlist.findUnique({
      where: { userId_gameId: { userId, gameId } },
    });
    if (!item) throw new NotFoundException('Wishlist entry not found');

    return this.prisma.wishlist.delete({ where: { id: item.id } });
  }
}
