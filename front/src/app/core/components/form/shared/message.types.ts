export interface MessageConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  show: boolean;
  dismissible?: boolean;
  icon?: string;
  duration?: number;
}
