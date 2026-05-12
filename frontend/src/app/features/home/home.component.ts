import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">
          Build Your <span class="text-highlight">Retro</span><br />Collection
        </h1>
        <p class="hero__subtitle">
          Track, organize, and showcase your classic game collection.
          Join a community of retro gaming collectors.
        </p>
        <div class="hero__actions">
          <a routerLink="/register">
            <app-button variant="primary" size="lg">Get Started</app-button>
          </a>
          <a routerLink="/explore">
            <app-button variant="outline" size="lg">Explore Catalog</app-button>
          </a>
        </div>
      </div>
      <div class="hero__stats">
        <div class="hero__stat">
          <span class="hero__stat-value">12,000+</span>
          <span class="hero__stat-label">Games Cataloged</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-value">5,500+</span>
          <span class="hero__stat-label">Collectors</span>
        </div>
        <div class="hero__stat">
          <span class="hero__stat-value">850+</span>
          <span class="hero__stat-label">Platforms</span>
        </div>
      </div>
    </section>

    <section class="features container">
      <h2 class="section-title">Everything You Need</h2>
      <div class="features__grid">
        <div class="feature-card">
          <span class="feature-card__icon">📚</span>
          <h3>Organize</h3>
          <p>Catalog your collection with detailed metadata, condition tracking, and personal notes.</p>
        </div>
        <div class="feature-card">
          <span class="feature-card__icon">🔍</span>
          <h3>Discover</h3>
          <p>Browse a public retro game database. Search by title, platform, genre, or release year.</p>
        </div>
        <div class="feature-card">
          <span class="feature-card__icon">⭐</span>
          <h3>Rate & Review</h3>
          <p>Share your thoughts on games. Read community reviews to discover hidden gems.</p>
        </div>
        <div class="feature-card">
          <span class="feature-card__icon">📊</span>
          <h3>Track Stats</h3>
          <p>View collection analytics — total value, platform distribution, completion stats.</p>
        </div>
        <div class="feature-card">
          <span class="feature-card__icon">💬</span>
          <h3>Connect</h3>
          <p>Follow other collectors, see their collections, and grow your retro network.</p>
        </div>
        <div class="feature-card">
          <span class="feature-card__icon">📱</span>
          <h3>Any Device</h3>
          <p>Fully responsive design. Manage your collection from desktop, tablet, or mobile.</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="cta__content container">
        <h2>Start Your Collection Today</h2>
        <p>Join thousands of retro gaming collectors. It's free.</p>
        <a routerLink="/register">
          <app-button variant="primary" size="lg">Create Free Account</app-button>
        </a>
      </div>
    </section>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
