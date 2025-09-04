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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../shared/base-input.component';
import { BaseInputConfig } from '../shared/base-input.interface';

export interface TextareaConfig extends BaseInputConfig {
  maxLength?: number;
  rows?: number;
  autoResize?: boolean;
}

@Component({
  selector: 'mb-textarea',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent
  extends BaseInputComponent
  implements ControlValueAccessor, OnInit
{
  @Input() config!: TextareaConfig;
  @Input() control?: FormControl;
  @Input() customErrors?: { [key: string]: string };

  ngOnInit() {
    if (!this.config) {
      throw new Error(
        'TextareaComponent requires a config input'
      );
    }
  }

  onInput(event: any): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
