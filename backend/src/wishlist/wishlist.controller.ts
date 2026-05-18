import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('wishlist')
@ApiBearerAuth()
@ApiTags('wishlist')
@ApiBearerAuth()
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getUserWishlist(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.wishlistService.getUserWishlist(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  async add(@Request() req: any, @Body() dto: CreateWishlistDto) {
    return this.wishlistService.add(req.user.id, dto);
  }

  @Put(':id')
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateWishlistDto) {
    return this.wishlistService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.wishlistService.remove(req.user.id, id);
  }
}
