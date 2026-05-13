import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

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
}
