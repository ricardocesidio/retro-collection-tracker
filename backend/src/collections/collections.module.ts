import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { CollectionsController } from './collections.controller';

@Module({
  controllers: [CollectionsController, StatsController],
  providers: [CollectionsService, StatsService],
  exports: [CollectionsService, StatsService],
})
export class CollectionsModule {}
