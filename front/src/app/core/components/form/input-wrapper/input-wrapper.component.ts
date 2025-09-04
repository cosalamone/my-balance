import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
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
  @Input() config!: InputWrapperConfig;
  @Input() control?: FormControl;
  @Input() customErrors?: { [key: string]: string };

  value: any = '';
  disabled = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit() {
    if (!this.config) {
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
    return (
      !this.config.type ||
      this.config.type === 'text' ||
      this.config.type === 'number' ||
      this.config.type === 'email' ||
      this.config.type === 'password'
    );
  }

  // Configuration mappers
  getTextInputConfig(): TextInputConfig {
    return {
      type:
        (this.config.type as
          | 'text'
          | 'number'
          | 'email'
          | 'password') || 'text',
      placeholder: this.config.placeholder,
      icon: this.config.icon,
      hint: this.config.hint,
      required: this.config.required,
      maxLength: this.config.maxLength,
      min: this.config.min,
      max: this.config.max,
      step: this.config.step,
      appearance: this.config.appearance,
      suffixIcon: this.config.suffixIcon,
      prefixText: this.config.prefixText,
      suffixText: this.config.suffixText,
    };
  }

  getTextareaConfig(): TextareaConfig {
    return {
      placeholder: this.config.placeholder,
      icon: this.config.icon,
      hint: this.config.hint,
      required: this.config.required,
      maxLength: this.config.maxLength,
      rows: this.config.rows,
      appearance: this.config.appearance,
      suffixIcon: this.config.suffixIcon,
      prefixText: this.config.prefixText,
      suffixText: this.config.suffixText,
      autoResize: this.config.autoResize,
    };
  }

  getDatepickerConfig(): DatepickerConfig {
    return {
      placeholder: this.config.placeholder,
      icon: this.config.icon,
      hint: this.config.hint,
      required: this.config.required,
      appearance: this.config.appearance,
      suffixIcon: this.config.suffixIcon,
      prefixText: this.config.prefixText,
      suffixText: this.config.suffixText,
      minDate: this.config.minDate,
      maxDate: this.config.maxDate,
      startView: this.config.startView,
      touchUi: this.config.touchUi,
      openOnFocus: this.config.openOnFocus,
    };
  }
}
