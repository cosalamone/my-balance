import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type MessageType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface MessageConfig {
  message: string;
  type: MessageType;
  show: boolean;
  dismissible?: boolean;
}

@Component({
  selector: 'mb-message',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() config!: MessageConfig;

  dismiss(): void {
    this.config.show = false;
  }

  getMessageClasses(): string {
    const baseClasses = 'border';

    switch (this.config.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200`;
    }
  }

  getIconClasses(): string {
    switch (this.config.type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  getTextClasses(): string {
    switch (this.config.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  }

  getIcon(): string {
    switch (this.config.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }
}
