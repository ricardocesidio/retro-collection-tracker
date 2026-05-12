import { Component, Input } from '@angular/core';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    <div class="alert alert--{{ variant }}" role="alert" [class.alert--dismissible]="dismissible">
      @if (icon) {
        <span class="alert__icon">{{ icon }}</span>
      }
      <div class="alert__content">
        @if (title) {
          <strong class="alert__title">{{ title }}</strong>
        }
        <p class="alert__message"><ng-content /></p>
      </div>
    </div>
  `,
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() title?: string;
  @Input() icon?: string;
  @Input() dismissible = false;
}
