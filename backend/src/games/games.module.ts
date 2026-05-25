import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { ExternalGamesService } from './external-games.service';
import { GamesController } from './games.controller';
import { CacheService } from '../common/cache.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, ExternalGamesService, CacheService],
  exports: [GamesService],
})
export class GamesModule {}
