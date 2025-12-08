import {
  Signal,
  Type,
  WritableSignal,
} from '@angular/core';
import { ButtonBaseComponent } from '../components/buttons/button-base.component';
export interface PermisoResponse {
  allowed: boolean;
  message?: string;
}

export interface ButtonBaseInterface {
  style: ButtonStyle;
  tooltipMessage?: string;
  optionDisabled?: boolean;
  iconName?: string;
  // Use a signal for permission checks (simpler than Observable)
  permission?: Signal<PermisoResponse>;
  label?: string;
  buttonType?: Type<
    ButtonBaseComponent<ButtonBaseInterface>
  >;
  action: (value?: any) => void;
  iconPosition?: 'left' | 'right';
  // WritableSignal allows components to update the disabled flag
  $optionDisabled?: WritableSignal<boolean>;
  id?: string;
}
export interface LinkableInterface {
  routerLink: string;
}

export interface SearchInterface {
  searchField: string;
  valueShowOpenSearch?: string;
  action: (value?: any) => void;
}
export interface RedirectableInterface {
  setResultRedirected: (value: any) => void;
}

export type ButtonStyle = 'outlined' | 'filled' | 'icon';
