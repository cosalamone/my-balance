import { FormControl } from '@angular/forms';
import { InputSignal } from '@angular/core';

export abstract class BaseInputComponent {
  // Signals-based inputs (InputSignal) to work with input<>() in children
  abstract config: InputSignal<any>;
  abstract control?: InputSignal<FormControl | undefined>;
  abstract customErrors?: InputSignal<{ [key: string]: string } | undefined>;

  value: any = '';
  disabled = false;

  protected onChange = (value: any) => {};
  protected onTouched = () => {};

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

  getErrorMessage(): string {
    const ctrl = this.control ? this.control() : undefined;
    if (!ctrl || !ctrl.errors) {
      return '';
    }

    const errors = ctrl.errors;

    // Custom errors first
    const custom = this.customErrors ? this.customErrors() : undefined;
    if (custom) {
      for (const [key, message] of Object.entries(custom)) {
        if (errors[key]) {
          return message;
        }
      }
    }

    // Default error messages
    if (errors['required']) {
      return `${this.config()?.placeholder} es requerido`;
    }

    if (errors['min']) {
      return `El valor mínimo es ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `El valor máximo es ${errors['max'].max}`;
    }

    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }

    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    }

    if (errors['email']) {
      return 'Formato de email inválido';
    }

    if (errors['pattern']) {
      return 'Formato inválido';
    }

    return 'Campo inválido';
  }
}
