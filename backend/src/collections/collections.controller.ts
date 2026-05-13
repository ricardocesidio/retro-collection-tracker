import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { StatsService } from './stats.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionQueryDto } from './dto/collection-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly statsService: StatsService,
  ) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.statsService.getCollectionStats(req.user.id);
  }

  @Get()
  async getUserCollection(
    @Request() req: any,
    @Query() query: CollectionQueryDto,
  ) {
    return this.collectionsService.getUserCollection(req.user.id, query);
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
