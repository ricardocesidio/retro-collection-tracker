import { Component, Input } from '@angular/core';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'highlight';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span class="badge badge--{{ variant }}">
      <ng-content />
    </span>
  `,
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
}
