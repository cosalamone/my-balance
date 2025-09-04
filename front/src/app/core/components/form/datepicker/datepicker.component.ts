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
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../shared/base-input.component';
import { BaseInputConfig } from '../shared/base-input.interface';

export interface DatepickerConfig
  extends BaseInputConfig {
  minDate?: Date;
  maxDate?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  touchUi?: boolean;
  openOnFocus?: boolean;
}

@Component({
  selector: 'mb-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent
  extends BaseInputComponent
  implements ControlValueAccessor, OnInit
{
  @Input() config!: DatepickerConfig;
  @Input() control?: FormControl;
  @Input() customErrors?: { [key: string]: string };

  ngOnInit() {
    if (!this.config) {
      throw new Error(
        'DatepickerComponent requires a config input'
      );
    }
  }

  onDateChange(event: any): void {
    const value = event.value;
    this.value = value;
    this.onChange(value);
  }

  onDateInput(event: any): void {
    const target = event.target as HTMLInputElement;
    const value = target.value
      ? new Date(target.value)
      : null;
    this.value = value;
    this.onChange(value);
  }
}
