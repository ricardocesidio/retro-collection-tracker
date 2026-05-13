import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Delete(':id')
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.wishlistService.remove(req.user.id, id);
  }
}
