import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function getCollectorLevel(gameCount: number): { name: string; tier: number } {
  if (gameCount >= 30) return { name: 'Museum', tier: 3 };
  if (gameCount >= 15) return { name: 'Curator', tier: 2 };
  if (gameCount >= 5) return { name: 'Collector', tier: 1 };
  return { name: 'New Collector', tier: 0 };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
    return { ...sanitized, level: getCollectorLevel(user._count.collections) };
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
    return { ...sanitized, level: getCollectorLevel(user._count.collections) };
  }
}

