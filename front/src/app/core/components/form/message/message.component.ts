import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../form/button/button.component';

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
  imports: [CommonModule, MatIconModule, ButtonComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  public readonly config = input<MessageConfig>();

  dismiss(): void {
    const cfg = this.config();
    if (cfg) {
      cfg.show = false;
    }
  }

  getMessageClasses(): string {
    const baseClasses = 'border';

    const t = this.config()?.type;
    switch (t) {
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
    const type = this.config()?.type;
    switch (type) {
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
    const type2 = this.config()?.type;
    switch (type2) {
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
    const type3 = this.config()?.type;
    switch (type3) {
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
