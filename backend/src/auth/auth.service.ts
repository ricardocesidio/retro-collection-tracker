import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

function getCollectorLevel(gameCount: number): { name: string; tier: number } {
  if (gameCount >= 30) return { name: 'Museum', tier: 3 };
  if (gameCount >= 15) return { name: 'Curator', tier: 2 };
  if (gameCount >= 5) return { name: 'Collector', tier: 1 };
  return { name: 'New Collector', tier: 0 };
}
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          displayName: dto.displayName || dto.username,
          password: passwordHash,
        },
      });

      const token = this.generateToken(user.id, user.email);
      return {
        user: this.sanitizeUser(user),
        token,
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        if (target?.includes('email')) {
          throw new ConflictException('Email already in use');
        }
        throw new ConflictException('Username already taken');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});

    const token = this.generateToken(user.id, user.email);
    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...this.sanitizeUser(user),
      stats: user._count,
      level: getCollectorLevel(user._count.collections),
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.username && { username: dto.username }),
          ...(dto.displayName !== undefined && { displayName: dto.displayName }),
          ...(dto.bio !== undefined && { bio: dto.bio }),
          ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        },
      });
      return this.sanitizeUser(user);
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target as string[];
        if (target?.includes('username')) {
          throw new ConflictException('Username already taken');
        }
      }
      throw error;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If the email exists, a reset link has been sent.' };

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    return {
      message: 'If the email exists, a reset link has been sent.',
      resetToken,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (payload.type !== 'password-reset') {
      throw new UnauthorizedException('Invalid reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { password: passwordHash },
    });

    return { message: 'Password has been reset successfully.' };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
