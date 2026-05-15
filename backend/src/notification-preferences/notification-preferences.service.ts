import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Injectable()
export class NotificationPreferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPreferences(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await this.prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return prefs;
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    const existing = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!existing) {
      return this.prisma.notificationPreference.create({
        data: { userId, ...dto },
      });
    }

    return this.prisma.notificationPreference.update({
      where: { userId },
      data: dto,
    });
  }
}
