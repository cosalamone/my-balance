import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

export type ButtonType =
  | 'primary'
  | 'accent'
  | 'warn'
  | 'basic'
  | 'stroked'
  | 'flat'
  | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonConfig {
  label: string;
  icon?: string;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  color?: 'primary' | 'accent' | 'warn';
  tooltip?: string;
}

@Component({
  selector: 'mb-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() config!: ButtonConfig;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.config.disabled && !this.config.loading) {
      this.buttonClick.emit();
    }
  }

  getButtonClasses(): string {
    const classes = [];

    // Size classes
    switch (this.config.size) {
      case 'small':
        classes.push('text-sm', 'px-3', 'py-1');
        break;
      case 'large':
        classes.push('text-lg', 'px-6', 'py-3');
        break;
      default: // medium
        classes.push('text-base', 'px-4', 'py-2');
    }

    // Full width
    if (this.config.fullWidth) {
      classes.push('w-full');
    }

    return classes.join(' ');
  }

  getIconClasses(): string {
    const classes = [];

    // Icon margin based on whether there's text
    if (this.config.label) {
      classes.push('mr-2');
    }

    // Icon size based on button size
    switch (this.config.size) {
      case 'small':
        classes.push('text-sm');
        break;
      case 'large':
        classes.push('text-xl');
        break;
      default:
        classes.push('text-base');
    }

    return classes.join(' ');
  }

  getSpinnerSize(): number {
    switch (this.config.size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  }
}
