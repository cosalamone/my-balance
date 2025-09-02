import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Gasto } from './gastos.service';

@Component({
  selector: 'app-gasto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gasto-form.page.html',
  styleUrls: ['./gasto-form.page.scss'],
})
export class GastoFormPage {
  @Input() gasto: Gasto = {
    amount: 0,
    category: '',
    description: '',
    date: '',
    isFixed: false,
    isRecurring: false,
  };
  @Output() save = new EventEmitter<Gasto>();
  @Output() cancel = new EventEmitter<void>();
  loading = false;

  categories = [
    'Housing',
    'Food',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Education',
    'Shopping',
    'Utilities',
    'Other',
  ];

  onSubmit() {
    this.loading = true;
    this.save.emit(this.gasto);
  }
}
