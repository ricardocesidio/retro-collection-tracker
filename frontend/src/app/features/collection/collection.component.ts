import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [RouterLink, CardComponent, BadgeComponent, ButtonComponent, InputComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Collection</h1>
          <p class="page-subtitle">47 games · Est. value: $2,450</p>
        </div>
        <app-button variant="primary" routerLink="/add-game">+ Add Game</app-button>
      </div>

      <div class="collection__filters">
        <app-input placeholder="Search collection..." type="search"></app-input>
        <select class="collection__select">
          <option value="">All Platforms</option>
          <option>SNES</option><option>NES</option><option>Genesis</option>
          <option>PlayStation</option><option>Nintendo 64</option>
        </select>
        <select class="collection__select">
          <option value="">All Conditions</option>
          <option>Mint</option><option>Near Mint</option><option>Very Good</option>
          <option>Good</option><option>Acceptable</option>
        </select>
      </div>

      <div class="collection__grid">
        @for (game of collection; track game.id) {
          <app-card
            [imageUrl]="game.imageUrl"
            [title]="game.title"
            [badge]="game.condition"
            [clickable]="true"
          >
            <ng-container card-title>
              <h3 class="game-card__title">{{ game.title }}</h3>
            </ng-container>
            <div class="game-card__meta">
              <app-badge variant="info">{{ game.platform }}</app-badge>
              <app-badge variant="highlight">{{ game.rating }}★</app-badge>
              <span class="game-card__value">\${{ game.value }}</span>
            </div>
          </app-card>
        }
      </div>
    </div>
  `,
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent {
  collection = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ['Super Metroid', 'Chrono Trigger', 'Zelda: A Link to the Past', 'Final Fantasy VI', 'Super Mario World', 'Donkey Kong Country', 'Mega Man X', 'EarthBound'][i],
    platform: ['SNES', 'SNES', 'SNES', 'SNES', 'SNES', 'SNES', 'SNES', 'SNES'][i],
    condition: ['Mint', 'Near Mint', 'Very Good', 'Good', 'Mint', 'Very Good', 'Good', 'Acceptable'][i],
    rating: [5, 5, 5, 5, 5, 4, 4, 5][i],
    value: [250, 200, 150, 180, 90, 85, 120, 400][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=Game+${i + 1}`,
  }));
}
