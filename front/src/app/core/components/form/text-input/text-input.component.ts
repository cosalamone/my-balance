import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../shared/base-input.component';
import { BaseInputConfig } from '../shared/base-input.interface';

export interface TextInputConfig extends BaseInputConfig {
  type?: 'text' | 'number' | 'email' | 'password';
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

@Component({
  selector: 'mb-text-input',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent
  extends BaseInputComponent
  implements ControlValueAccessor, OnInit
{
  public readonly config = input<TextInputConfig>();
  public readonly control = input<FormControl | undefined>();
  public readonly customErrors = input<{ [key: string]: string } | undefined>();

  ngOnInit() {
    if (!this.config()) {
      throw new Error('TextInputComponent requires a config input');
    }
  }

  onInput(event: any): void {
    const target = event.target as HTMLInputElement;
    let value: any = target.value;

    const cfg = this.config();
    if (cfg?.type === 'number') {
      value = value === '' ? null : parseFloat(value);
    }

    this.value = value;
    this.onChange(value);
  }
}
