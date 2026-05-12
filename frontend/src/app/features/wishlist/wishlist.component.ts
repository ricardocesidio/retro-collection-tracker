import { Component } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CardComponent, BadgeComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Wishlist</h1>
          <p class="page-subtitle">12 games you want to collect</p>
        </div>
      </div>

      <div class="wishlist__grid">
        @for (game of wishlist; track game.id) {
          <app-card
            [imageUrl]="game.imageUrl"
            [title]="game.title"
            [badge]="'Priority ' + game.priority"
            [clickable]="true"
          >
            <ng-container card-title>
              <h3 class="game-card__title">{{ game.title }}</h3>
            </ng-container>
            <div class="game-card__meta">
              <app-badge variant="info">{{ game.platform }}</app-badge>
              <app-badge variant="default">{{ game.genre }}</app-badge>
              <span class="game-card__price">{{ '$' + game.estimatedPrice }}</span>
            </div>
          </app-card>
        }
      </div>
    </div>
  `,
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent {
  wishlist = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ['EarthBound', 'Castlevania: SOTN', 'Panzer Dragoon Saga', 'Snatcher', 'MUSHA', 'Radiant Silvergun', 'Shining Force III', 'Suikoden II'][i],
    platform: ['SNES', 'PlayStation', 'Saturn', 'Sega CD', 'Genesis', 'Saturn', 'Saturn', 'PlayStation'][i],
    genre: ['RPG', 'Action', 'RPG', 'Adventure', 'Shooter', 'Shooter', 'RPG', 'RPG'][i],
    priority: [1, 1, 2, 2, 3, 2, 3, 1][i],
    estimatedPrice: [350, 180, 600, 500, 300, 250, 200, 280][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=Wish+${i + 1}`,
  }));
}
