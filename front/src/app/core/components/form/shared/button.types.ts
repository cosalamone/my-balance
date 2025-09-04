export interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'warn'
    | 'stroked'
    | 'flat'
    | 'icon'
    | 'fab'
    | 'mini-fab';
  color?: 'primary' | 'accent' | 'warn';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  tooltip?: string;
  fullWidth?: boolean;
}
