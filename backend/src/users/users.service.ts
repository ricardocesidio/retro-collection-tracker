import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { XpService } from '../xp/xp.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly xpService: XpService,
  ) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            collections: true,
            wishlists: true,
            reviews: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...sanitized } = user;
    const xpLevel = this.xpService.getLevel(user.xp || 0);
    return { ...sanitized, level: { ...xpLevel, xp: user.xp || 0 } };
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            collections: true,
            wishlists: true,
            reviews: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password, ...sanitized } = user;
    const xpLevel = this.xpService.getLevel(user.xp || 0);
    return { ...sanitized, level: { ...xpLevel, xp: user.xp || 0 } };
  }
}
