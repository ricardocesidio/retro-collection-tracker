import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('stats')
@ApiBearerAuth()
@Controller('stats')
export class StatsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Get('public')
  async getPublicStats() {
    const [gameCount, platformCount, userCount] = await Promise.all([
      this.prisma.game.count(),
      this.prisma.platform.count(),
      this.prisma.user.count({ where: { isActive: true } }),
    ]);

    return {
      games: gameCount,
      platforms: platformCount,
      collectors: userCount,
    };
  }

  @Get('donate')
  async getDonateStats() {
    return {
      raised: this.config.get<number>('DONATE_RAISED', 247),
      goal: this.config.get<number>('DONATE_GOAL', 500),
      supporters: this.config.get<number>('DONATE_SUPPORTERS', 34),
    };
  }

  @Get('leaderboard')
  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        collections: {
          select: { estimatedValue: true },
        },
        _count: { select: { collections: true } },
      },
    });

    const ranked = users
      .map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        totalValue: u.collections.reduce((sum, c) => sum + (c.estimatedValue || 0), 0),
        gameCount: u._count.collections,
      }))
      .filter((u) => u.totalValue > 0)
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    return ranked;
  }
}
