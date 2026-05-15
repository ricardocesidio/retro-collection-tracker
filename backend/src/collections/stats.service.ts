import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollectionStats(userId: string) {
    const filter = { where: { userId } };

    const [
      totalGames,
      totalValueResult,
      platformAgg,
      conditionAgg,
      recentAdditions,
      mostValuable,
      highestRated,
      recentReviews,
      recentActivity,
      wishlistItems,
    ] = await Promise.all([
      this.prisma.collection.count(filter),
      this.prisma.collection.aggregate({ ...filter, _sum: { estimatedValue: true }, _avg: { personalRating: true } }),
      this.prisma.collection.groupBy({ by: ['gameId'], ...filter, _count: { gameId: true } }),
      this.prisma.collection.groupBy({ by: ['condition'], ...filter, _count: { condition: true } }),
      this.prisma.collection.findMany({ ...filter, include: { game: { include: { platform: true } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
      this.prisma.collection.findFirst({ where: { userId, estimatedValue: { not: null } }, include: { game: { include: { platform: true } } }, orderBy: { estimatedValue: 'desc' } }),
      this.prisma.collection.findFirst({ where: { userId, personalRating: { not: null } }, include: { game: { include: { platform: true } } }, orderBy: { personalRating: 'desc' } }),
      this.prisma.review.findMany({ where: { userId }, include: { game: { include: { platform: true } }, user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } }, orderBy: { createdAt: 'desc' }, take: 5 }),
      this.prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8 }),
      this.prisma.wishlist.findMany({ where: { userId }, include: { game: { include: { platform: true, genre: true } } }, orderBy: { priority: 'asc' }, take: 4 }),
    ]);

    // Resolve platform/game names
    const gameIds = platformAgg.map((g) => g.gameId);
    const games = await this.prisma.game.findMany({
      where: { id: { in: gameIds } },
      include: { platform: true, genre: true },
    });
    const gameMap = new Map(games.map((g) => [g.id, g]));

    // Platform distribution
    const platMap = new Map<string, { id: string; name: string; count: number }>();
    for (const item of platformAgg) {
      const game = gameMap.get(item.gameId);
      if (!game) continue;
      const p = game.platform;
      const existing = platMap.get(p.id);
      if (existing) existing.count += item._count.gameId;
      else platMap.set(p.id, { id: p.id, name: p.name, count: item._count.gameId });
    }
    const platformDistribution = Array.from(platMap.values())
      .map((p) => ({ ...p, percentage: Math.round((p.count / totalGames) * 100) }))
      .sort((a, b) => b.count - a.count);

    // Genre distribution
    const genreMap = new Map<string, { id: string; name: string; count: number }>();
    for (const item of platformAgg) {
      const game = gameMap.get(item.gameId);
      if (!game) continue;
      const g = game.genre;
      const existing = genreMap.get(g.id);
      if (existing) existing.count += item._count.gameId;
      else genreMap.set(g.id, { id: g.id, name: g.name, count: item._count.gameId });
    }
    const genreDistribution = Array.from(genreMap.values())
      .map((g) => ({ ...g, percentage: Math.round((g.count / totalGames) * 100) }))
      .sort((a, b) => b.count - a.count);

    const conditionDistribution = conditionAgg.map((c) => ({
      condition: c.condition,
      count: c._count.condition,
      percentage: Math.round((c._count.condition / totalGames) * 100),
    })).sort((a, b) => b.count - a.count);

    const wishlistCount = await this.prisma.wishlist.count({ where: { userId } });

    return {
      summary: {
        totalGames,
        totalValue: Math.round((totalValueResult._sum.estimatedValue || 0) * 100) / 100,
        avgRating: totalValueResult._avg.personalRating ? parseFloat(totalValueResult._avg.personalRating.toFixed(1)) : null,
        wishlistCount,
      },
      platformDistribution,
      genreDistribution,
      conditionDistribution,
      recentAdditions: recentAdditions.map((item) => ({
        id: item.id,
        gameId: item.gameId,
        title: item.game.title,
        platform: item.game.platform.name,
        coverImageUrl: item.game.coverImageUrl,
        description: item.game.description || '',
        condition: item.condition,
        score: item.personalRating != null ? item.personalRating + '.0' : null,
        estimatedValue: item.estimatedValue,
        addedAt: item.createdAt,
      })),
      recentReviews: recentReviews.map((r) => ({
        id: r.id,
        gameId: r.gameId,
        gameTitle: r.game.title,
        platform: r.game.platform.name,
        coverImageUrl: r.game.coverImageUrl,
        rating: r.rating,
        title: r.title,
        body: r.body,
        user: { username: r.user.username, displayName: r.user.displayName, avatarUrl: r.user.avatarUrl },
        createdAt: r.createdAt,
      })),
      recentActivity: recentActivity.map((a) => ({
        id: a.id,
        type: a.type,
        message: a.message,
        createdAt: a.createdAt,
      })),
      wishlistSpotlight: wishlistItems.map((w) => ({
        id: w.id,
        gameId: w.gameId,
        title: w.game.title,
        platform: w.game.platform.name,
        genre: w.game.genre.name,
        priority: w.priority,
        coverImageUrl: w.game.coverImageUrl,
      })),
      highlights: {
        mostValuable: mostValuable ? { id: mostValuable.id, gameId: mostValuable.gameId, title: mostValuable.game.title, platform: mostValuable.game.platform.name, value: mostValuable.estimatedValue } : null,
        highestRated: highestRated ? { id: highestRated.id, gameId: highestRated.gameId, title: highestRated.game.title, platform: highestRated.game.platform.name, rating: highestRated.personalRating } : null,
      },
    };
  }

  async getValueHistory(userId: string) {
    const items = await this.prisma.collection.findMany({
      where: { userId },
      select: { estimatedValue: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const months = ['Dec','Jan','Feb','Mar','Apr','May'];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const result: { month: string; value: number }[] = [];
    let cumulative = 0;

    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const monthEnd = i === 5
        ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
        : new Date(now.getFullYear(), now.getMonth() - 4 + i, 1);

      for (const item of items) {
        const d = new Date(item.createdAt);
        if (d >= monthStart && d < monthEnd) {
          cumulative += item.estimatedValue || 0;
        }
      }

      result.push({
        month: months[(now.getMonth() - 5 + i + 12) % 12] || months[i],
        value: Math.round(cumulative),
      });
    }

    return result;
  }
}
