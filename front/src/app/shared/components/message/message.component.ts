import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type MessageType =
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

@Component({
  selector: 'mb-message',
  standalone: true,
  template: `
    <div
      *ngIf="message"
      [class]="getMessageClasses()"
      [attr.role]="type === 'error' ? 'alert' : 'status'"
      [attr.aria-live]="
        type === 'error' ? 'assertive' : 'polite'
      "
    >
      <mat-icon class="message__icon">{{
        getIcon()
      }}</mat-icon>

      <div>
        <p *ngIf="title" class="message__title">
          {{ title }}
        </p>
        <p class="message__text">{{ message }}</p>
      </div>
    </div>
  `,
  imports: [CommonModule, MatIconModule],
})
export class MessageComponent {
  @Input() message: string = '';
  @Input() title?: string;
  @Input() type: MessageType = 'info';
  @Input() variant: 'default' | 'simple' = 'default';

  getMessageClasses(): string {
    const baseClass = 'message';
    const typeClass = `message--${this.type}`;
    const variantClass =
      this.variant === 'simple' ? 'message--simple' : '';

    return [baseClass, typeClass, variantClass]
      .filter(Boolean)
      .join(' ');
  }

  getIcon(): string {
    const icons = {
      error: 'error_outline',
      success: 'check_circle_outline',
      warning: 'warning_outline',
      info: 'info_outline',
    };

    return icons[this.type];
  }
}
