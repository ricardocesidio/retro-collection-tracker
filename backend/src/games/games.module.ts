import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { ExternalGamesService } from './external-games.service';
import { GamesController } from './games.controller';

@Module({
  controllers: [GamesController],
  providers: [GamesService, ExternalGamesService],
  exports: [GamesService],
})
export class GamesModule {}
