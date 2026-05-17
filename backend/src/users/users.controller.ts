import { Controller, Get, Param, ApiTags, ApiBearerAuth } from '@nestjs/common';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
