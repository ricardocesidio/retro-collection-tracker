import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card" [class.card--clickable]="clickable">
      @if (imageUrl) {
        <div class="card__image">
          <img [src]="imageUrl" [alt]="title || 'Card image'" loading="lazy" />
          @if (badge) {
            <span class="card__badge">{{ badge }}</span>
          }
        </div>
      }
      <div class="card__body">
        <ng-content select="[card-title]"></ng-content>
        <ng-content></ng-content>
      </div>
      @if (footerShown) {
        <div class="card__footer">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() imageUrl?: string;
  @Input() title?: string;
  @Input() badge?: string;
  @Input() clickable = false;
  @Input() footerShown = false;
}
