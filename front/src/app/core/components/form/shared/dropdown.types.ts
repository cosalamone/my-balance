export interface DropdownOption {
  value: any;
  label: string;
  icon?: string;
}

export interface DropdownConfig {
  placeholder: string;
  options: DropdownOption[];
  icon?: string;
  hint?: string;
  required?: boolean;
  appearance?: 'fill' | 'outline';
  multiple?: boolean;
  filterable?: boolean;
  noOptionsText?: string;
}
