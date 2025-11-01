import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
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
  public readonly config = input<ButtonConfig>();
  @Output() buttonClick = new EventEmitter<void>();
  public readonly onClickCallback = input<(() => void) | undefined>();

  onClick(): void {
    const cfg = this.config();
    if (!cfg?.disabled && !cfg?.loading) {
      const cb = this.onClickCallback();
      if (cb) cb();
      this.buttonClick.emit();
    }
  }

  getButtonClasses(): string {
    const classes = [];
    const cfg = this.config() || ({} as ButtonConfig);

    // Size classes
    switch (cfg.size) {
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
    if (cfg.fullWidth) {
      classes.push('w-full');
    }

    return classes.join(' ');
  }

  getIconClasses(): string {
    const classes = [];
    const cfg = this.config() || ({} as ButtonConfig);

    // Icon margin based on whether there's text
    if (cfg.label) {
      classes.push('mr-2');
    }

    // Icon size based on button size
    switch (cfg.size) {
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
    const cfg = this.config() || ({} as ButtonConfig);
    switch (cfg.size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  }
}
