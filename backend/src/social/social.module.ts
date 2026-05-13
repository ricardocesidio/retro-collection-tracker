import { Module } from '@nestjs/common';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [SocialController, NotificationsController],
  providers: [SocialService, NotificationsService],
  exports: [SocialService, NotificationsService],
})
export class SocialModule {}
