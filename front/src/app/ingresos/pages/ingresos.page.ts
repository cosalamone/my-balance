import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import {
  MatSort,
  MatSortModule,
} from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import {
  Income,
  IncomeCategory,
} from '../../core/models/financial.models';
import { FinancialDataService } from '../../core/services/financial-data.service';

@Component({
  selector: 'mb-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  incomeForm!: FormGroup;
  incomes$!: Observable<Income[]>;
  dataSource = new MatTableDataSource<Income>();
  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'amount',
    'actions',
  ];

  incomeCategories = [
    {
      value: IncomeCategory.SALARY,
      label: 'Haberes',
      icon: 'work',
    },
    {
      value: IncomeCategory.BONUS,
      label: 'Bonos',
      icon: 'star',
    },
    {
      value: IncomeCategory.GIFT,
      label: 'Regalos',
      icon: 'card_giftcard',
    },
    {
      value: IncomeCategory.FREELANCE,
      label: 'Freelance',
      icon: 'laptop',
    },
    {
      value: IncomeCategory.INVESTMENT,
      label: 'Inversiones',
      icon: 'trending_up',
    },
    {
      value: IncomeCategory.OTHER,
      label: 'Otros',
      icon: 'category',
    },
  ];

  incomeSources = [
    {
      value: 'bank_transfer',
      label: 'Transferencia Bancaria',
      icon: 'account_balance',
    },
    { value: 'cash', label: 'Efectivo', icon: 'local_atm' },
    { value: 'check', label: 'Cheque', icon: 'receipt' },
    {
      value: 'digital_wallet',
      label: 'Billetera Digital',
      icon: 'account_balance_wallet',
    },
    { value: 'other', label: 'Otro', icon: 'more_horiz' },
  ];

  isLoading = false;
  editingId: string | null = null;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIncomes();
  }

  private initForm(): void {
    this.incomeForm = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(0.01)],
      ],
      description: [
        '',
        [Validators.required, Validators.minLength(3)],
      ],
      category: [
        IncomeCategory.SALARY,
        Validators.required,
      ],
      source: ['bank_transfer', Validators.required],
      date: [new Date(), Validators.required],
      isRecurring: [false],
    });
  }

  private loadIncomes(): void {
    // Load incomes from server first
    this.financialService.getIncomes().subscribe({
      next: incomes => {
        console.log('Incomes loaded from server:', incomes);
      },
      error: error => {
        console.error('Error loading incomes:', error);
        this.showMessage('Error al cargar los ingresos');
      },
    });

    // Subscribe to the observable for reactive updates
    this.incomes$ = this.financialService.incomes$;
    this.financialService.incomes$.subscribe(
      (incomes: Income[]) => {
        this.dataSource.data = incomes.sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  onSubmit(): void {
    if (this.incomeForm.valid) {
      this.isLoading = true;
      const formValue = {
        ...this.incomeForm.value,
        date: this.incomeForm.value.date || new Date(),
      };

      if (this.editingId !== null) {
        this.financialService
          .updateIncome(this.editingId, formValue)
          .subscribe({
            next: updatedIncome => {
              this.showMessage(
                'Ingreso actualizado exitosamente'
              );
              this.editingId = null;
              this.resetForm();
              this.isLoading = false;
            },
            error: error => {
              console.error(
                'Error updating income:',
                error
              );
              this.showMessage(
                'Error al actualizar el ingreso'
              );
              this.isLoading = false;
            },
          });
      } else {
        this.financialService
          .addIncome(formValue)
          .subscribe({
            next: newIncome => {
              this.showMessage(
                'Ingreso agregado exitosamente'
              );
              this.resetForm();
              this.isLoading = false;
              // Scroll to top to show the success message
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            },
            error: error => {
              console.error('Error adding income:', error);
              this.showMessage(
                'Error al agregar el ingreso'
              );
              this.isLoading = false;
            },
          });
      }
    } else {
      this.markFormGroupTouched();
      this.showMessage(
        'Por favor, complete todos los campos requeridos'
      );
    }
  }

  editIncome(income: Income): void {
    this.editingId = income.id;
    this.incomeForm.patchValue({
      amount: income.amount,
      description: income.description,
      category: income.category,
      date: new Date(income.date),
      isRecurring: income.isRecurring || false,
    });
  }

  deleteIncome(id: string): void {
    if (
      confirm(
        '¿Está seguro de que desea eliminar este ingreso?'
      )
    ) {
      this.financialService.deleteIncome(id).subscribe({
        next: () => {
          this.showMessage(
            'Ingreso eliminado exitosamente'
          );
        },
        error: error => {
          console.error('Error deleting income:', error);
          this.showMessage('Error al eliminar el ingreso');
        },
      });
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.incomeForm.reset({
      amount: '',
      description: '',
      date: new Date(),
      category: '',
      source: '',
    });
    this.editingId = null;
    this.isLoading = false;
    // Mark all fields as untouched to remove validation errors
    this.incomeForm.markAsUntouched();
    this.incomeForm.markAsPristine();
    Object.keys(this.incomeForm.controls).forEach(key => {
      this.incomeForm.get(key)?.markAsUntouched();
      this.incomeForm.get(key)?.markAsPristine();
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.incomeForm.controls).forEach(key => {
      const control = this.incomeForm.get(key);
      control?.markAsTouched();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement)
      .value;
    this.dataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }

  private showMessage(message: string): void {
    this.message = message;
    // Clear message after 5 seconds
    setTimeout(() => {
      this.message = '';
    }, 5000);

    // Also show snackbar
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.incomeForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a 0`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      amount: 'La cantidad',
      description: 'La descripción',
      category: 'La categoría',
      source: 'La fuente',
      date: 'La fecha',
    };
    return labels[fieldName] || fieldName;
  }

  getCategoryLabel(category: IncomeCategory): string {
    const cat = this.incomeCategories.find(
      c => c.value === category
    );
    return cat ? cat.label : 'Otros';
  }

  getTotalIncome(): number {
    return this.dataSource.data.reduce(
      (total: number, income: Income) =>
        total + income.amount,
      0
    );
  }

  getCategoryIcon(category: IncomeCategory): string {
    const iconMap: Record<IncomeCategory, string> = {
      [IncomeCategory.SALARY]: 'work',
      [IncomeCategory.BONUS]: 'star',
      [IncomeCategory.FREELANCE]: 'computer',
      [IncomeCategory.INVESTMENT]: 'trending_up',
      [IncomeCategory.GIFT]: 'card_giftcard',
      [IncomeCategory.AGUINALDO]: 'payments',
      [IncomeCategory.OTHER]: 'more_horiz',
    };
    return iconMap[category] || 'more_horiz';
  }

  scrollToForm(): void {
    const formElement = document.querySelector(
      '.income-form-card'
    );
    if (formElement) {
      formElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
