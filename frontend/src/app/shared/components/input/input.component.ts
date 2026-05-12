import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="input-group" [class.input-group--error]="error">
      @if (label) {
        <label class="input-group__label" [for]="inputId">
          {{ label }}
          @if (required) {
            <span class="input-group__required">*</span>
          }
        </label>
      }
      <div class="input-group__wrapper">
        @if (prefix) {
          <span class="input-group__prefix">{{ prefix }}</span>
        }
        @if (type === 'textarea') {
          <textarea
            [id]="inputId"
            class="input-group__control input-group__control--textarea"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [value]="value"
            (input)="onInput($event)"
            (blur)="onTouched()"
            [rows]="rows"
          ></textarea>
        } @else {
          <input
            [id]="inputId"
            class="input-group__control"
            [type]="type"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [value]="value"
            (input)="onInput($event)"
            (blur)="onTouched()"
          />
        }
        @if (suffix) {
          <span class="input-group__suffix">{{ suffix }}</span>
        }
      </div>
      @if (error) {
        <span class="input-group__error">{{ error }}</span>
      }
      @if (hint && !error) {
        <span class="input-group__hint">{{ hint }}</span>
      }
    </div>
  `,
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() rows = 4;
  @Input() inputId = 'input-' + Math.random().toString(36).slice(2, 9);

  value = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    this.onChange(this.value);
  }
}
