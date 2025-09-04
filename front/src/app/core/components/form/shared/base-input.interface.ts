import { FormControl } from '@angular/forms';

export interface BaseInputConfig {
  placeholder: string;
  icon?: string;
  hint?: string;
  required?: boolean;
  appearance?: 'fill' | 'outline';
  suffixIcon?: string;
  prefixText?: string;
  suffixText?: string;
}

export interface BaseInputProps {
  config: BaseInputConfig;
  control?: FormControl;
  customErrors?: { [key: string]: string };
}
