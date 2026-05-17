import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, email: true, username: true, displayName: true,
          role: true, isActive: true, isEmailVerified: true,
          createdAt: true, lastLoginAt: true,
          _count: { select: { collections: true, reviews: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUserRole(userId: string, role: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: { id: true, username: true, role: true },
    });
  }

  async toggleUserActive(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
    if (!user) throw new Error('User not found');
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, username: true, isActive: true },
    });
  }

  async listGames(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where,
        include: { platform: true, genre: true, _count: { select: { collections: true, reviews: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.game.count({ where }),
    ]);
    return { data: games, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
