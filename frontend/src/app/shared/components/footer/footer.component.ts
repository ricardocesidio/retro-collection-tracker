import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <span class="footer__logo">🎮 RetroTracker</span>
          <p class="footer__tagline">Your retro gaming collection, beautifully organized.</p>
        </div>
        <div class="footer__links">
          <a routerLink="/explore">Explore</a>
          <a routerLink="/collection">My Collection</a>
          <a routerLink="/wishlist">Wishlist</a>
          <a routerLink="/dashboard">Dashboard</a>
        </div>
        <div class="footer__bottom">
          <p>&copy; {{ year }} Retro Collection Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
