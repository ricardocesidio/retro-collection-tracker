import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationPreferencesService } from './notification-preferences.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Controller('notification-preferences')
@UseGuards(JwtAuthGuard)
export class NotificationPreferencesController {
  constructor(private readonly service: NotificationPreferencesService) {}

  @Get()
  async get(@Request() req: any) {
    return this.service.getPreferences(req.user.id);
  }

  @Put()
  async update(@Request() req: any, @Body() dto: UpdateNotificationPreferencesDto) {
    return this.service.updatePreferences(req.user.id, dto);
  }
}
