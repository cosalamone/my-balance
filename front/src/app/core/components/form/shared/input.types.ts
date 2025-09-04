import { BaseInputConfig } from './base-input.interface';

export interface InputWrapperConfig
  extends BaseInputConfig {
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'tel'
    | 'textarea'
    | 'date';
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  autocomplete?: string;
}
