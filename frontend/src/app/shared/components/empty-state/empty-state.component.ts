import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">{{ icon }}</div>
      <h3 class="empty-state__title">{{ title }}</h3>
      @if (message) {
        <p class="empty-state__message">{{ message }}</p>
      }
      <div class="empty-state__actions">
        <ng-content />
      </div>
    </div>
  `,
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() icon = '📦';
  @Input() title = 'Nothing here yet';
  @Input() message = '';
}
