import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { StatsService } from './stats.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionQueryDto } from './dto/collection-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly statsService: StatsService,
  ) {}

  @Get('export')
  async exportCollection(@Request() req: any, @Query('format') format: string, @Res() res: Response) {
    const data = await this.collectionsService.getAllForExport(req.user.id);

    if (format === 'csv') {
      const header = 'Title,Platform,Genre,Release Year,Developer,Publisher,Condition,Region,Rating,Estimated Value,Notes,Cover URL';
      const rows = data.map((item) =>
        [
          `"${item.game.title.replace(/"/g, '""')}"`,
          `"${item.game.platform.name}"`,
          `"${item.game.genre.name}"`,
          item.game.releaseYear,
          `"${(item.game.developer || '').replace(/"/g, '""')}"`,
          `"${(item.game.publisher || '').replace(/"/g, '""')}"`,
          item.condition,
          item.region,
          item.personalRating || '',
          item.estimatedValue ?? '',
          `"${(item.notes || '').replace(/"/g, '""')}"`,
          item.game.coverImageUrl || '',
        ].join(','),
      );
      const csv = [header, ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="collection.csv"');
      return res.send(csv);
    }

    const json = data.map((item) => ({
      title: item.game.title,
      platform: item.game.platform.name,
      genre: item.game.genre.name,
      releaseYear: item.game.releaseYear,
      developer: item.game.developer,
      publisher: item.game.publisher,
      condition: item.condition,
      region: item.region,
      personalRating: item.personalRating,
      estimatedValue: item.estimatedValue,
      notes: item.notes,
      coverImageUrl: item.game.coverImageUrl,
    }));
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="collection.json"');
    return res.send(json);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.statsService.getCollectionStats(req.user.id);
  }

  @Get('value-history')
  async getValueHistory(@Request() req: any) {
    return this.statsService.getValueHistory(req.user.id);
  }

  @Get()
  async getUserCollection(
    @Request() req: any,
    @Query() query: CollectionQueryDto,
  ) {
    return this.collectionsService.getUserCollection(req.user.id, query);
  }

  @Public()
  @Get('user/:userId')
  async getPublicCollection(
    @Param('userId') userId: string,
    @Query() query: CollectionQueryDto,
  ) {
    return this.collectionsService.getUserCollection(userId, query);
  }

  @Get(':id')
  async findById(@Request() req: any, @Param('id') id: string) {
    return this.collectionsService.findById(req.user.id, id);
  }

  @Post()
  async addToCollection(@Request() req: any, @Body() dto: CreateCollectionDto) {
    return this.collectionsService.addToCollection(req.user.id, dto);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.collectionsService.remove(req.user.id, id);
  }
}
