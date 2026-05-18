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
import { getCollectorLevel } from '../common/utils/collector-level';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      const verificationToken = this.jwtService.sign(
        { sub: 'verify', email: dto.email, type: 'email-verification' },
        { expiresIn: '24h' },
      );

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          displayName: dto.displayName || dto.username,
          password: passwordHash,
          emailVerificationToken: verificationToken,
        },
      });

      console.log(
        `[DEV] Email verification link: ${process.env.API_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`,
      );

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

    await this.prisma.user
      .update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })
      .catch(() => {});

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
          ...(dto.displayName !== undefined && {
            displayName: dto.displayName,
          }),
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

  async verifyEmail(dto: VerifyEmailDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.token);
    } catch {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    if (payload.type !== 'email-verification') {
      throw new UnauthorizedException('Invalid verification token');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isEmailVerified) return { message: 'Email already verified.' };

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerificationToken: null },
    });

    return { message: 'Email verified successfully.' };
  }

  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isEmailVerified) return { message: 'Email already verified.' };

    const verificationToken = this.jwtService.sign(
      { sub: 'verify', email: user.email, type: 'email-verification' },
      { expiresIn: '24h' },
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerificationToken: verificationToken },
    });

    console.log(
      `[DEV] Email verification link: ${process.env.API_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`,
    );

    return { message: 'Verification email sent.' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    return { message: 'Password changed successfully.' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    // Always return success to prevent email enumeration
    if (!user)
      return { message: 'If the email exists, a reset link has been sent.' };

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    // TODO: Send resetToken via email in production
    return {
      message: 'If the email exists, a reset link has been sent.',
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

  async changeEmail(userId: string, newEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // Check if user has exceeded email change limit (3 times)
    if (user.emailChangeCount >= 3) {
      throw new ConflictException(
        'Email change limit exceeded (maximum 3 changes allowed)',
      );
    }

    // Check if new email already exists
    const emailExists = await this.prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (emailExists && emailExists.id !== userId) {
      throw new ConflictException('Email already in use');
    }

    // Update email and increment change count
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
        emailChangeCount: { increment: 1 },
        // Reset email verification since email changed
        isEmailVerified: false,
        emailVerificationToken: this.jwtService.sign(
          { sub: 'verify', email: newEmail, type: 'email-verification' },
          { expiresIn: '24h' },
        ),
      },
    });

    // Generate new token with updated email
    const token = this.generateToken(userId, newEmail);

    // Log verification link in dev
    console.log(
      `[DEV] Email verification link: ${process.env.API_URL || 'http://localhost:3000'}/auth/verify-email?token=${this.jwtService.sign(
        { sub: 'verify', email: newEmail, type: 'email-verification' },
        { expiresIn: '24h' },
      )}`,
    );

    return {
      message: 'Email changed successfully. Please verify your new email.',
      token,
    };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  private sanitizeUser(user: any) {
    const { password, emailVerificationToken, ...sanitized } = user;
    return sanitized;
  }
}
