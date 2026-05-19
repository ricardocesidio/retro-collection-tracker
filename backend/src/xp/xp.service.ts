import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class XpService {
  private readonly XP_RULES = {
    ADD_GAME: 10,
    ADD_REVIEW: 15,
    ADD_WISHLIST: 5,
    LOGIN: 2,
    GET_FOLLOWER: 20,
    WRITE_COMMENT: 3,
  };

  constructor(private readonly prisma: PrismaService) {}

  async award(userId: string, action: keyof typeof this.XP_RULES) {
    const points = this.XP_RULES[action];
    if (!points) return;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: points } },
      select: { xp: true },
    });

    const level = this.getLevel(user.xp);
    return { xp: user.xp, pointsAwarded: points, level };
  }

  getLevel(xp: number) {
    if (xp >= 500) return { name: 'Museum Curator', tier: 3, currentXp: xp, nextLevelXp: 0 };
    if (xp >= 200) return { name: 'Master Collector', tier: 2, currentXp: xp, nextLevelXp: 500 };
    if (xp >= 50) return { name: 'Avid Collector', tier: 1, currentXp: xp, nextLevelXp: 200 };
    return { name: 'New Collector', tier: 0, currentXp: xp, nextLevelXp: 50 };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });
    if (!user) return null;
    return this.getLevel(user.xp);
  }
}
