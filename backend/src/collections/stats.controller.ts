import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

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
}
