import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open) {
      <div class="modal-backdrop" (click)="closeOnBackdrop && close.emit()">
        <div class="modal" [class.modal--{{ size }}]="true" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <h3 class="modal__title">{{ title }}</h3>
            <button class="modal__close" (click)="close.emit()" aria-label="Close">&times;</button>
          </div>
          <div class="modal__body">
            <ng-content />
          </div>
          @if (footerShown) {
            <div class="modal__footer">
              <ng-content select="[modal-footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() footerShown = false;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close.emit();
    }
  }
}
