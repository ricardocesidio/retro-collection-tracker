import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ActivityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllForExport(userId: string) {
    return this.prisma.collection.findMany({
      where: { userId },
      include: { game: { include: { platform: true, genre: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserCollection(
    userId: string,
    query: {
      search?: string;
      platform?: string;
      condition?: string;
      sort?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const { search, platform, condition, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const sortMap: Record<string, any> = {
      newest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      title_asc: { game: { title: 'asc' } },
      title_desc: { game: { title: 'desc' } },
      rating_asc: { personalRating: { sort: 'asc', nulls: 'last' } },
      rating_desc: { personalRating: { sort: 'desc', nulls: 'last' } },
      value_asc: { estimatedValue: { sort: 'asc', nulls: 'last' } },
      value_desc: { estimatedValue: { sort: 'desc', nulls: 'last' } },
    };

    const orderBy = query.sort && sortMap[query.sort] ? sortMap[query.sort] : { createdAt: 'desc' as const };

    const where: any = { userId };
    if (search)
      where.game = { title: { contains: search, mode: 'insensitive' } };
    if (platform) where.game = { ...(where.game || {}), platformId: platform };
    if (condition) where.condition = condition;

    const [items, total] = await Promise.all([
      this.prisma.collection.findMany({
        where,
        include: { game: { include: { platform: true, genre: true } } },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.collection.count({ where }),
    ]);

    const totalValue = await this.prisma.collection.aggregate({
      where: { userId },
      _sum: { estimatedValue: true },
    });

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalValue: totalValue._sum.estimatedValue || 0,
    };
  }

  async findById(userId: string, id: string) {
    const item = await this.prisma.collection.findFirst({
      where: { id, userId },
      include: { game: { include: { platform: true, genre: true } } },
    });
    if (!item) throw new NotFoundException('Collection entry not found');
    return item;
  }

  async addToCollection(userId: string, dto: CreateCollectionDto) {
    const existing = await this.prisma.collection.findUnique({
      where: { userId_gameId: { userId, gameId: dto.gameId } },
    });
    if (existing)
      throw new ConflictException('Game already in your collection');

    const item = await this.prisma.collection.create({
      data: { ...dto, userId },
      include: { game: { include: { platform: true, genre: true } } },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        type: ActivityType.ADDED_GAME,
        targetId: dto.gameId,
        targetType: 'Game',
        message: `Added ${item.game.title} to collection`,
      },
    }).catch(() => {});

    return item;
  }

  async update(userId: string, id: string, dto: UpdateCollectionDto) {
    const item = await this.prisma.collection.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Collection entry not found');

    return this.prisma.collection.update({
      where: { id },
      data: dto,
      include: { game: { include: { platform: true, genre: true } } },
    });
  }

  async remove(userId: string, id: string) {
    const item = await this.prisma.collection.findFirst({
      where: { id, userId },
    });
    if (!item) throw new NotFoundException('Collection entry not found');

    return this.prisma.collection.delete({ where: { id } });
  }
}
