import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;
  let bcrypt: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    displayName: 'TestUser',
    password: '$2a$12$hashedpassword',
    role: 'USER',
    isActive: true,
    bio: null,
    avatarUrl: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    bcrypt = require('bcryptjs');
    bcrypt.compare.mockReset().mockResolvedValue(true);
    bcrypt.hash.mockReset().mockResolvedValue('hashed');

    prisma = {
      user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
        count: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return user and token on valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'correct',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      bcrypt.compare.mockResolvedValue(false);
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@test.com', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create user and return token', async () => {
      prisma.user.create.mockResolvedValue({
        ...mockUser,
        email: 'new@test.com',
        username: 'newuser',
      });

      const result = await service.register({
        email: 'new@test.com',
        username: 'newuser',
        password: 'password123',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('new@test.com');
    });

    it('should throw ConflictException on duplicate email', async () => {
      prisma.user.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      await expect(
        service.register({
          email: 'exists@test.com',
          username: 'user',
          password: 'pass123456',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('should return user with stats', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        _count: {
          collections: 5,
          wishlists: 2,
          reviews: 3,
          followers: 4,
          following: 6,
        },
      });

      const result = await service.getProfile('user-1');
      expect(result.stats.collections).toBe(5);
    });
  });
});
