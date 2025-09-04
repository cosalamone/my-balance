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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface DropdownOption {
  value: any;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface DropdownConfig {
  placeholder: string;
  options: DropdownOption[];
  required?: boolean;
  multiple?: boolean;
  appearance?: 'fill' | 'outline';
  icon?: string;
  hint?: string;
  autocomplete?: boolean; // Si true, usa autocomplete en lugar de select
  allowClear?: boolean;
}

@Component({
  selector: 'mb-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent
  implements ControlValueAccessor, OnInit
{
  @Input() config!: DropdownConfig;
  @Input() control?: FormControl;
  @Input() customErrors?: { [key: string]: string };

  value: any = null;
  displayValue = '';
  disabled = false;
  filteredOptions!: Observable<DropdownOption[]>;

  private onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    if (!this.config) {
      throw new Error(
        'DropdownComponent requires a config input'
      );
    }

    if (this.config.autocomplete) {
      this.initializeAutocomplete();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.config.autocomplete) {
      this.updateDisplayValue();
    }
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

  onSelectionChange(event: any): void {
    this.value = event.value;
    this.onChange(this.value);
  }

  onAutocompleteInput(event: any): void {
    const target = event.target as HTMLInputElement;
    this.displayValue = target.value;
  }

  onAutocompleteSelection(event: any): void {
    this.value = event.option.value;
    this.onChange(this.value);
    this.updateDisplayValue();
  }

  private initializeAutocomplete(): void {
    this.filteredOptions = new Observable<string>(
      observer => {
        observer.next(this.displayValue);
      }
    ).pipe(
      startWith(''),
      map(value => this.filterOptions(value || ''))
    );
  }

  private filterOptions(value: string): DropdownOption[] {
    const filterValue = value.toLowerCase();
    return this.config.options.filter(option =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  private updateDisplayValue(): void {
    const selectedOption = this.config.options.find(
      opt => opt.value === this.value
    );
    this.displayValue = selectedOption
      ? selectedOption.label
      : '';
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

    return 'Selección inválida';
  }
}
