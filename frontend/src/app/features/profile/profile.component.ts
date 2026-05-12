import { Component } from '@angular/core';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent, CardComponent],
  template: `
    <div class="page-container">
      <div class="profile__header">
        <div class="profile__avatar">
          <img src="https://placehold.co/120x120/1a1a30/e0e0e0?text=RC" alt="Avatar" />
        </div>
        <div class="profile__info">
          <h1 class="profile__name">retro_collector</h1>
          <p class="profile__bio">SNES enthusiast. Building a complete NA library one cartridge at a time.</p>
          <div class="profile__meta">
            <span><strong>47</strong> games</span>
            <span><strong>128</strong> followers</span>
            <span><strong>89</strong> following</span>
          </div>
          <div class="profile__actions">
            <app-button variant="primary">Follow</app-button>
            <app-button variant="outline">Message</app-button>
          </div>
        </div>
      </div>

      <div class="profile__tabs">
        <button class="profile__tab profile__tab--active">Collection</button>
        <button class="profile__tab">Wishlist</button>
        <button class="profile__tab">Reviews</button>
      </div>

      <div class="profile__grid">
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
            </div>
          </app-card>
        }
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  collection = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ['Super Metroid', 'Chrono Trigger', 'Zelda ALTTP', 'FFVI', 'Super Mario World', 'DKC', 'Mega Man X', 'EarthBound'][i],
    platform: ['SNES', 'SNES', 'SNES', 'SNES', 'SNES', 'SNES', 'SNES', 'SNES'][i],
    condition: ['Mint', 'Near Mint', 'Very Good', 'Good', 'Mint', 'Very Good', 'Good', 'Good'][i],
    rating: [5, 5, 5, 5, 5, 4, 4, 5][i],
    imageUrl: `https://placehold.co/300x400/1a1a30/e0e0e0?text=Game+${i + 1}`,
  }));
}
