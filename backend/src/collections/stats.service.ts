import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollectionStats(userId: string) {
    const collectionFilter = { where: { userId } };

    const [
      totalGames,
      totalValueResult,
      platformAgg,
      genreAgg,
      conditionAgg,
      recentAdditions,
      mostValuable,
      highestRated,
    ] = await Promise.all([
      this.prisma.collection.count(collectionFilter),
      this.prisma.collection.aggregate({
        ...collectionFilter,
        _sum: { estimatedValue: true },
        _avg: { personalRating: true },
      }),
      this.prisma.collection.groupBy({
        by: ['gameId'],
        ...collectionFilter,
        _count: { gameId: true },
      }),
      this.prisma.collection.groupBy({
        by: ['gameId'],
        ...collectionFilter,
        _count: { gameId: true },
      }),
      this.prisma.collection.groupBy({
        by: ['condition'],
        ...collectionFilter,
        _count: { condition: true },
      }),
      this.prisma.collection.findMany({
        ...collectionFilter,
        include: { game: { include: { platform: true, genre: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.collection.findFirst({
        where: { userId, estimatedValue: { not: null } },
        include: { game: { include: { platform: true } } },
        orderBy: { estimatedValue: 'desc' },
      }),
      this.prisma.collection.findFirst({
        where: { userId, personalRating: { not: null } },
        include: { game: { include: { platform: true } } },
        orderBy: { personalRating: 'desc' },
      }),
    ]);

    // Resolve platform names for distribution (need one findMany for the game IDs)
    const gameIds = platformAgg.map((g) => g.gameId);
    const games = await this.prisma.game.findMany({
      where: { id: { in: gameIds } },
      include: { platform: true, genre: true },
    });
    const gameMap = new Map(games.map((g) => [g.id, g]));

    const platformMap = new Map<string, { id: string; name: string; count: number }>();
    for (const item of platformAgg) {
      const game = gameMap.get(item.gameId);
      if (!game) continue;
      const p = game.platform;
      const existing = platformMap.get(p.id);
      if (existing) existing.count += item._count.gameId;
      else platformMap.set(p.id, { id: p.id, name: p.name, count: item._count.gameId });
    }
    const platformDistribution = Array.from(platformMap.values())
      .map((p) => ({ ...p, percentage: Math.round((p.count / totalGames) * 100) }))
      .sort((a, b) => b.count - a.count);

    const genreMap = new Map<string, { id: string; name: string; count: number }>();
    for (const item of genreAgg) {
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

    const conditionDistribution = conditionAgg
      .map((c) => ({
        condition: c.condition,
        count: c._count.condition,
        percentage: Math.round((c._count.condition / totalGames) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const totalValue = totalValueResult._sum.estimatedValue || 0;
    const avgRating = totalValueResult._avg.personalRating
      ? parseFloat(totalValueResult._avg.personalRating.toFixed(1))
      : null;

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
