import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async getUserCollection(
    @Request() req: any,
    @Query('search') search?: string,
    @Query('platform') platform?: string,
    @Query('condition') condition?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.collectionsService.getUserCollection(req.user.id, {
      search,
      platform,
      condition,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
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
