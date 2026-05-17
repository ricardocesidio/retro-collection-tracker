import {
  Controller, Get, Post, Delete, Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } = from '../auth/guards/jwt-auth.guard;
import { ApiTags, ApiBearerAuth } = from '@nestjs/swagger';

@ApiTags('social')
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('follow/:userId')
  async follow(@Request() req: any, @Param('userId') userId: string) {
    return this.socialService.follow(req.user.id, userId);
  }

  @Delete('follow/:userId')
  async unfollow(@Request() req: any, @Param('userId') userId: string) {
    return this.socialService.unfollow(req.user.id, userId);
  }

  @Get('follow/:userId/status')
  async isFollowing(@Request() req: any, @Param('userId') userId: string) {
    return this.socialService.isFollowing(req.user.id, userId);
  }

  @Get('users/:userId/followers')
  async getFollowers(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.socialService.getFollowers(userId, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('users/:userId/following')
  async getFollowing(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.socialService.getFollowing(userId, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('activity')
  async getActivity(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.socialService.getActivity(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }
}
