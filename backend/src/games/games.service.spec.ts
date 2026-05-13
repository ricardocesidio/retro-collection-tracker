import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GamesService } from './games.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GamesService', () => {
  let service: GamesService;
  let prisma: any;

  const mockGame = {
    id: 'game-1',
    title: 'Super Metroid',
    platformId: 'platform-snes',
    genreId: 'genre-action',
    releaseYear: 1994,
    developer: 'Nintendo',
    publisher: 'Nintendo',
    platform: { id: 'platform-snes', name: 'SNES', slug: 'snes' },
    genre: { id: 'genre-action', name: 'Action', slug: 'action' },
    _count: { collections: 5, wishlists: 2, reviews: 3 },
  };

  beforeEach(async () => {
    prisma = {
      game: {
        findMany: jest.fn().mockResolvedValue([mockGame]),
        findUnique: jest.fn().mockResolvedValue(mockGame),
        create: jest.fn().mockResolvedValue(mockGame),
        update: jest.fn().mockResolvedValue(mockGame),
        delete: jest.fn().mockResolvedValue(mockGame),
        count: jest.fn().mockResolvedValue(30),
      },
      platform: {
        findMany: jest.fn().mockResolvedValue([{ id: 'snes', name: 'SNES', slug: 'snes' }]),
      },
      genre: {
        findMany: jest.fn().mockResolvedValue([{ id: 'action', name: 'Action', slug: 'action' }]),
      },
      review: {
        aggregate: jest.fn().mockResolvedValue({ _avg: { rating: 4.5 } }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should return paginated games', async () => {
    const result = await service.findAll({});
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(30);
  });

  it('should return game by id with avg rating', async () => {
    const result = await service.findById('game-1');
    expect(result.title).toBe('Super Metroid');
    expect(result.avgRating).toBe(4.5);
  });

  it('should throw NotFoundException for missing game', async () => {
    prisma.game.findUnique.mockResolvedValue(null);
    await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
  });

  it('should return platforms', async () => {
    const result = await service.getPlatforms();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('SNES');
  });

  it('should create a game', async () => {
    const result = await service.create({
      title: 'New Game',
      platformId: 'snes',
      genreId: 'action',
      releaseYear: 2000,
    });
    expect(result.title).toBe('Super Metroid');
  });
});
