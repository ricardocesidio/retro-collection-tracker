import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollectionStats(userId: string) {
    const [totalGames, totalValueResult, allItems, recentAdditions] =
      await Promise.all([
        this.prisma.collection.count({ where: { userId } }),
        this.prisma.collection.aggregate({
          where: { userId },
          _sum: { estimatedValue: true },
          _avg: { personalRating: true },
        }),
        this.prisma.collection.findMany({
          where: { userId },
          include: { game: { include: { platform: true, genre: true } } },
        }),
        this.prisma.collection.findMany({
          where: { userId },
          include: { game: { include: { platform: true, genre: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    const totalValue = totalValueResult._sum.estimatedValue || 0;
    const avgRating = totalValueResult._avg.personalRating
      ? parseFloat(totalValueResult._avg.personalRating.toFixed(1))
      : null;

    // Platform distribution
    const platformMap = new Map<string, { id: string; name: string; count: number }>();
    for (const item of allItems) {
      const p = item.game.platform;
      const existing = platformMap.get(p.id);
      if (existing) existing.count++;
      else platformMap.set(p.id, { id: p.id, name: p.name, count: 1 });
    }
    const platformDistribution = Array.from(platformMap.values())
      .map((p) => ({ ...p, percentage: Math.round((p.count / totalGames) * 100) }))
      .sort((a, b) => b.count - a.count);

    // Genre distribution
    const genreMap = new Map<string, { id: string; name: string; count: number }>();
    for (const item of allItems) {
      const g = item.game.genre;
      const existing = genreMap.get(g.id);
      if (existing) existing.count++;
      else genreMap.set(g.id, { id: g.id, name: g.name, count: 1 });
    }
    const genreDistribution = Array.from(genreMap.values())
      .map((g) => ({ ...g, percentage: Math.round((g.count / totalGames) * 100) }))
      .sort((a, b) => b.count - a.count);

    // Condition distribution
    const conditionMap = new Map<string, number>();
    for (const item of allItems) {
      conditionMap.set(item.condition, (conditionMap.get(item.condition) || 0) + 1);
    }
    const conditionDistribution = Array.from(conditionMap.entries())
      .map(([condition, count]) => ({
        condition,
        count,
        percentage: Math.round((count / totalGames) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Most valuable and highest rated
    const mostValuable = allItems
      .filter((i) => i.estimatedValue != null)
      .sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0))[0] || null;

    const highestRated = allItems
      .filter((i) => i.personalRating != null)
      .sort((a, b) => (b.personalRating || 0) - (a.personalRating || 0))[0] || null;

    return {
      summary: {
        totalGames,
        totalValue: Math.round(totalValue * 100) / 100,
        avgRating,
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
        condition: item.condition,
        personalRating: item.personalRating,
        estimatedValue: item.estimatedValue,
        addedAt: item.createdAt,
      })),
      highlights: {
        mostValuable: mostValuable
          ? {
              id: mostValuable.id,
              gameId: mostValuable.gameId,
              title: mostValuable.game.title,
              platform: mostValuable.game.platform.name,
              coverImageUrl: mostValuable.game.coverImageUrl,
              value: mostValuable.estimatedValue,
            }
          : null,
        highestRated: highestRated
          ? {
              id: highestRated.id,
              gameId: highestRated.gameId,
              title: highestRated.game.title,
              platform: highestRated.game.platform.name,
              coverImageUrl: highestRated.game.coverImageUrl,
              rating: highestRated.personalRating,
            }
          : null,
      },
    };
  }
}
