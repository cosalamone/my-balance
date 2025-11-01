import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

// Importar los componentes específicos
import {
  DatepickerComponent,
  DatepickerConfig,
} from '../datepicker/datepicker.component';
import {
  TextInputComponent,
  TextInputConfig,
} from '../text-input/text-input.component';
import {
  TextareaComponent,
  TextareaConfig,
} from '../textarea/textarea.component';

// Interface de compatibilidad que combina todas las configuraciones
export interface InputWrapperConfig {
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'textarea';
  placeholder: string;
  icon?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  rows?: number; // Para textarea
  appearance?: 'fill' | 'outline';
  suffixIcon?: string;
  prefixText?: string;
  suffixText?: string;
  // Propiedades específicas de datepicker
  minDate?: Date;
  maxDate?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  touchUi?: boolean;
  openOnFocus?: boolean;
  // Propiedades específicas de textarea
  autoResize?: boolean;
}

@Component({
  selector: 'mb-input',
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    TextareaComponent,
    DatepickerComponent,
  ],
  templateUrl: './input-wrapper.component.html',
  styleUrls: ['./input-wrapper.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputWrapperComponent),
      multi: true,
    },
  ],
})
export class InputWrapperComponent
  implements ControlValueAccessor, OnInit
{
  public readonly config = input<InputWrapperConfig>();
  public readonly control = input<
    FormControl | undefined
  >();
  public readonly customErrors = input<
    { [key: string]: string } | undefined
  >();

  value: any = '';
  disabled = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    if (!this.config()) {
      throw new Error(
        'InputWrapperComponent requires a config input'
      );
    }
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Helper methods to determine which component to use
  isTextInput(): boolean {
    const cfg = this.config();
    return (
      !cfg?.type ||
      cfg.type === 'text' ||
      cfg.type === 'number' ||
      cfg.type === 'email' ||
      cfg.type === 'password'
    );
  }

  // Configuration mappers
  getTextInputConfig(): TextInputConfig {
    const cfg = this.config() || ({} as InputWrapperConfig);
    return {
      type:
        (cfg.type as
          | 'text'
          | 'number'
          | 'email'
          | 'password') || 'text',
      placeholder: cfg.placeholder,
      icon: cfg.icon,
      hint: cfg.hint,
      required: cfg.required,
      maxLength: cfg.maxLength,
      min: cfg.min,
      max: cfg.max,
      step: cfg.step,
      appearance: cfg.appearance,
      suffixIcon: cfg.suffixIcon,
      prefixText: cfg.prefixText,
      suffixText: cfg.suffixText,
    };
  }

  getTextareaConfig(): TextareaConfig {
    const cfg = this.config() || ({} as InputWrapperConfig);
    return {
      placeholder: cfg.placeholder,
      icon: cfg.icon,
      hint: cfg.hint,
      required: cfg.required,
      maxLength: cfg.maxLength,
      rows: cfg.rows,
      appearance: cfg.appearance,
      suffixIcon: cfg.suffixIcon,
      prefixText: cfg.prefixText,
      suffixText: cfg.suffixText,
      autoResize: cfg.autoResize,
    };
  }

  getDatepickerConfig(): DatepickerConfig {
    const cfg = this.config() || ({} as InputWrapperConfig);
    return {
      placeholder: cfg.placeholder,
      icon: cfg.icon,
      hint: cfg.hint,
      required: cfg.required,
      appearance: cfg.appearance,
      suffixIcon: cfg.suffixIcon,
      prefixText: cfg.prefixText,
      suffixText: cfg.suffixText,
      minDate: cfg.minDate,
      maxDate: cfg.maxDate,
      startView: cfg.startView,
      touchUi: cfg.touchUi,
      openOnFocus: cfg.openOnFocus,
    };
  }
}
