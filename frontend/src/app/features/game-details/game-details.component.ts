import { Component } from '@angular/core';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent],
  template: `
    <div class="page-container">
      <div class="game-detail">
        <div class="game-detail__image">
          <img src="https://placehold.co/600x800/1a1a30/e0e0e0?text=Game+Cover" alt="Game cover" />
        </div>
        <div class="game-detail__info">
          <div class="game-detail__header">
            <h1 class="page-title">Super Metroid</h1>
            <div class="game-detail__tags">
              <app-badge variant="info">SNES</app-badge>
              <app-badge variant="default">Action</app-badge>
              <app-badge variant="highlight">1994</app-badge>
            </div>
          </div>

          <div class="game-detail__meta">
            <div class="game-detail__meta-item">
              <span class="label">Developer</span>
              <span class="value">Nintendo</span>
            </div>
            <div class="game-detail__meta-item">
              <span class="label">Publisher</span>
              <span class="value">Nintendo</span>
            </div>
            <div class="game-detail__meta-item">
              <span class="label">Region</span>
              <span class="value">NTSC</span>
            </div>
          </div>

          <p class="game-detail__description">
            Super Metroid is an action-adventure game developed and published by Nintendo for the Super Nintendo Entertainment System. The third installment in the Metroid series, it follows bounty hunter Samus Aran as she travels to planet Zebes to retrieve a stolen Metroid.
          </p>

          <div class="game-detail__actions">
            <app-button variant="primary">Add to Collection</app-button>
            <app-button variant="outline">Add to Wishlist</app-button>
            <app-button variant="ghost">Write Review</app-button>
          </div>

          <div class="game-detail__stats">
            <div class="stat">
              <span class="stat__value">4.8</span>
              <span class="stat__label">Avg Rating</span>
            </div>
            <div class="stat">
              <span class="stat__value">2.3k</span>
              <span class="stat__label">In Collections</span>
            </div>
            <div class="stat">
              <span class="stat__value">890</span>
              <span class="stat__label">Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent {}
