import { Component } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CardComponent, BadgeComponent, InputComponent],
  template: `
    <div class="page-container">
      <h1 class="page-title">Explore Catalog</h1>
      <p class="page-subtitle">Browse the retro gaming database</p>

      <div class="explore__filters">
        <app-input placeholder="Search games..." type="search"></app-input>
        <div class="explore__filter-group">
          <select class="explore__select">
            <option value="">All Platforms</option>
            <option>NES</option>
            <option>SNES</option>
            <option>Sega Genesis</option>
            <option>PlayStation</option>
            <option>Nintendo 64</option>
            <option>Game Boy</option>
            <option>Atari 2600</option>
          </select>
          <select class="explore__select">
            <option value="">All Genres</option>
            <option>Action</option>
            <option>RPG</option>
            <option>Platformer</option>
            <option>Shooter</option>
            <option>Puzzle</option>
            <option>Racing</option>
            <option>Fighting</option>
          </select>
        </div>
      </div>

      <div class="explore__grid">
        @for (game of placeholderGames; track game.id) {
          <app-card
            [imageUrl]="game.imageUrl"
            [title]="game.title"
            [badge]="game.platform"
            [clickable]="true"
          >
            <ng-container card-title>
              <h3 class="game-card__title">{{ game.title }}</h3>
            </ng-container>
            <div class="game-card__meta">
              <app-badge variant="info">{{ game.platform }}</app-badge>
              <app-badge variant="default">{{ game.genre }}</app-badge>
              <span class="game-card__year">{{ game.releaseYear }}</span>
            </div>
          </app-card>
        }
      </div>
    </div>
  `,
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent {
  placeholderGames = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: [
      'Super Metroid', 'Chrono Trigger', 'The Legend of Zelda',
      'Sonic the Hedgehog 2', 'Castlevania', 'Final Fantasy VI',
      'Mega Man X', 'Donkey Kong Country', 'Street Fighter II',
      'Metroid', 'Super Mario World', 'Contra',
    ][i],
    platform: ['SNES', 'SNES', 'NES', 'Genesis', 'NES', 'SNES', 'SNES', 'SNES', 'SNES', 'NES', 'SNES', 'NES'][i],
    genre: ['Action', 'RPG', 'Adventure', 'Platformer', 'Action', 'RPG', 'Action', 'Platformer', 'Fighting', 'Action', 'Platformer', 'Action'][i],
    releaseYear: [1994, 1995, 1986, 1992, 1986, 1994, 1993, 1994, 1991, 1986, 1990, 1987][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=${encodeURIComponent(['Super Metroid', 'Chrono Trigger', 'Zelda', 'Sonic 2', 'Castlevania', 'FFVI', 'Mega Man X', 'DKC', 'SFII', 'Metroid', 'SMW', 'Contra'][i])}`,
  }));
}
