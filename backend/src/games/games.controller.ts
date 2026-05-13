import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameQueryDto } from './dto/game-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async findAll(@Query() query: GameQueryDto) {
    return this.gamesService.findAll(query);
  }

  @Get('platforms')
  async getPlatforms() {
    return this.gamesService.getPlatforms();
  }

  @Get('genres')
  async getGenres() {
    return this.gamesService.getGenres();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.gamesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  async update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
