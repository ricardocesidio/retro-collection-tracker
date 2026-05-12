import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loading-spinner" [class.loading-spinner--full]="fullPage">
      <div class="loading-spinner__ring"></div>
      @if (message) {
        <p class="loading-spinner__message">{{ message }}</p>
      }
    </div>
  `,
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading...';
  @Input() fullPage = false;
}
