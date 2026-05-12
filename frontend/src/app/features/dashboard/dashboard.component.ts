import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="page-container">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Your collection at a glance</p>

      <div class="dashboard__stats">
        <div class="stat-card">
          <span class="stat-card__icon">📚</span>
          <div class="stat-card__info">
            <span class="stat-card__value">47</span>
            <span class="stat-card__label">Games Owned</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">💎</span>
          <div class="stat-card__info">
            <span class="stat-card__value">$2,450</span>
            <span class="stat-card__label">Est. Collection Value</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">⭐</span>
          <div class="stat-card__info">
            <span class="stat-card__value">12</span>
            <span class="stat-card__label">Wishlist Items</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-card__icon">📝</span>
          <div class="stat-card__info">
            <span class="stat-card__value">8</span>
            <span class="stat-card__label">Reviews Written</span>
          </div>
        </div>
      </div>

      <div class="dashboard__grid">
        <div class="dashboard__section">
          <h2 class="section-title">Platform Distribution</h2>
          <div class="platform-list">
            @for (p of platforms; track p.name) {
              <div class="platform-item">
                <span>{{ p.name }}</span>
                <div class="platform-item__bar">
                  <div class="platform-item__fill" [style.width.%]="p.percentage"></div>
                </div>
                <span>{{ p.count }}</span>
              </div>
            }
          </div>
        </div>

        <div class="dashboard__section">
          <h2 class="section-title">Recent Activity</h2>
          <div class="activity-list">
            @for (a of activities; track a.id) {
              <div class="activity-item">
                <span class="activity-item__type">{{ a.icon }}</span>
                <div class="activity-item__content">
                  <p>{{ a.message }}</p>
                  <span class="activity-item__time">{{ a.time }}</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  platforms = [
    { name: 'SNES', count: 15, percentage: 32 },
    { name: 'NES', count: 12, percentage: 26 },
    { name: 'Genesis', count: 8, percentage: 17 },
    { name: 'PlayStation', count: 6, percentage: 13 },
    { name: 'Nintendo 64', count: 4, percentage: 8 },
    { name: 'Other', count: 2, percentage: 4 },
  ];

  activities = [
    { id: 1, icon: '➕', message: 'Added <strong>Chrono Trigger</strong> to your collection', time: '2 hours ago' },
    { id: 2, icon: '⭐', message: 'Reviewed <strong>Super Metroid</strong> — 5 stars', time: '1 day ago' },
    { id: 3, icon: '📌', message: 'Saved <strong>EarthBound</strong> to your wishlist', time: '2 days ago' },
    { id: 4, icon: '👤', message: '<strong>retrofan42</strong> started following you', time: '3 days ago' },
  ];
}
