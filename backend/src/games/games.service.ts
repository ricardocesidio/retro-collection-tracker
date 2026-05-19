import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    platform?: string;
    genre?: string;
    year?: number;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, platform, genre, year, sort, page = 1, limit = 24 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (platform) where.platformId = platform;
    if (genre) where.genreId = genre;
    if (year) where.releaseYear = year;

    const orderBy: any = (() => {
      switch (sort) {
        case 'newest':
          return { releaseYear: 'desc' as const };
        case 'oldest':
          return { releaseYear: 'asc' as const };
        case 'title':
          return { title: 'asc' as const };
        case 'popular':
          return { collections: { _count: 'desc' as const } };
        default:
          return { title: 'asc' as const };
      }
    })();

    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where,
        include: {
          platform: true,
          genre: true,
          _count: { select: { collections: true } },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.game.count({ where }),
    ]);

    return {
      data: games,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPlatforms() {
    return this.prisma.platform.findMany({ orderBy: { name: 'asc' } });
  }

  async getGenres() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        platform: true,
        genre: true,
        reviews: {
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
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: { collections: true, wishlists: true, reviews: true },
        },
      },
    });
    if (!game) throw new NotFoundException('Game not found');

    const avgRating = await this.prisma.collection.aggregate({
      where: { gameId: id, personalRating: { not: null } },
      _avg: { personalRating: true },
    });

    // Get related games (same platform or genre)
    const related = await this.prisma.game.findMany({
      where: {
        OR: [{ platformId: game.platformId }, { genreId: game.genreId }],
        id: { not: id },
      },
      include: { platform: true, genre: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    return { ...game, avgRating: avgRating._avg.personalRating || null, related };
  }

  async getRelated(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      select: { platformId: true, genreId: true },
    });
    if (!game) return [];

    return this.prisma.game.findMany({
      where: {
        OR: [{ platformId: game.platformId }, { genreId: game.genreId }],
        id: { not: id },
      },
      include: { platform: true, genre: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateGameDto) {
    return this.prisma.game.create({
      data: dto,
      include: { platform: true, genre: true },
    });
  }

  async update(id: string, dto: UpdateGameDto) {
    return this.prisma.game.update({
      where: { id },
      data: dto,
      include: { platform: true, genre: true },
    });
  }

  async remove(id: string) {
    return this.prisma.game.delete({ where: { id } });
  }
}
