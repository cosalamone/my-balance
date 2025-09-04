import { FormControl } from '@angular/forms';

export abstract class BaseInputComponent {
  abstract config: any;
  abstract control?: FormControl;
  abstract customErrors?: { [key: string]: string };

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
    if (!this.control || !this.control.errors) {
      return '';
    }

    const errors = this.control.errors;

    // Custom errors first
    if (this.customErrors) {
      for (const [key, message] of Object.entries(
        this.customErrors
      )) {
        if (errors[key]) {
          return message;
        }
      }
    }

    // Default error messages
    if (errors['required']) {
      return `${this.config.placeholder} es requerido`;
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
