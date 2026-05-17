import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getCollectorLevel } from '../common/utils/collector-level';

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

