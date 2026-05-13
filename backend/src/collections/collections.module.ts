import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { StatsService } from './stats.service';
import { CollectionsController } from './collections.controller';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, StatsService],
  exports: [CollectionsService, StatsService],
})
export class CollectionsModule {}
