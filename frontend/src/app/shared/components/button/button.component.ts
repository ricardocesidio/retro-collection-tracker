import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [class]="'btn btn--' + variant + ' btn--' + size"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading"
      (click)="onClick()"
    >
      @if (loading) {
        <span class="btn__spinner"></span>
      }
      <span class="btn__content" [class.btn__content--hidden]="loading">
        <ng-content />
      </span>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() btnClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit();
    }
  }
}
