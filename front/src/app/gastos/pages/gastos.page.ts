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
import {
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
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
  Expense,
  ExpenseCategory,
  ExpenseType,
} from '../../core/models/financial.models';
import { FinancialDataService } from '../../core/services/financial-data.service';

@Component({
  selector: 'mb-gastos',
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
    MatOptionModule,
  ],
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class ExpenseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  expenseForm!: FormGroup;
  expenses$!: Observable<Expense[]>;
  dataSource = new MatTableDataSource<Expense>();
  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'type',
    'amount',
    'actions',
  ];

  expenseCategories = [
    {
      value: ExpenseCategory.HOUSING,
      label: 'Vivienda',
      icon: 'home',
    },
    {
      value: ExpenseCategory.FOOD,
      label: 'Alimentación',
      icon: 'restaurant',
    },
    {
      value: ExpenseCategory.TRANSPORTATION,
      label: 'Transporte',
      icon: 'directions_car',
    },
    {
      value: ExpenseCategory.ENTERTAINMENT,
      label: 'Entretenimiento',
      icon: 'movie',
    },
    {
      value: ExpenseCategory.HEALTHCARE,
      label: 'Salud',
      icon: 'local_hospital',
    },
    {
      value: ExpenseCategory.EDUCATION,
      label: 'Educación',
      icon: 'school',
    },
    {
      value: ExpenseCategory.SHOPPING,
      label: 'Compras',
      icon: 'shopping_bag',
    },
    {
      value: ExpenseCategory.UTILITIES,
      label: 'Servicios',
      icon: 'flash_on',
    },
    {
      value: ExpenseCategory.OTHER,
      label: 'Otros',
      icon: 'category',
    },
  ];

  expenseTypes = [
    {
      value: ExpenseType.FIXED,
      label: 'Fijo',
      icon: 'push_pin',
    },
    {
      value: ExpenseType.VARIABLE,
      label: 'Variable',
      icon: 'tune',
    },
  ];

  isLoading = false;
  editingId: string | null = null;
  message = '';
  showMessageFlag = false;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadExpenses();
  }

  private initForm(): void {
    this.expenseForm = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(0.01)],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
        ],
      ],
      category: [
        ExpenseCategory.OTHER,
        Validators.required,
      ],
      type: [ExpenseType.VARIABLE, Validators.required],
      date: [new Date(), Validators.required],
      isFixed: [false],
      isRecurring: [false],
    });
  }

  private loadExpenses(): void {
    // Load expenses from server first
    this.financialService.getExpenses().subscribe({
      next: expenses => {
        console.log(
          'Expenses loaded from server:',
          expenses
        );
      },
      error: error => {
        console.error('Error loading expenses:', error);
        this.displayMessage('Error al cargar los gastos');
      },
    });

    // Subscribe to the observable for reactive updates
    this.expenses$ = this.financialService.expenses$;
    this.financialService.expenses$.subscribe(
      (expenses: Expense[]) => {
        this.dataSource.data = expenses.sort(
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
    if (this.expenseForm.valid) {
      this.isLoading = true;
      const formValue = {
        ...this.expenseForm.value,
        date: this.expenseForm.value.date || new Date(),
        isFixed:
          this.expenseForm.value.type ===
            ExpenseType.FIXED ||
          this.expenseForm.value.isFixed,
      };

      if (this.editingId !== null) {
        this.financialService
          .updateExpense(this.editingId, formValue)
          .subscribe({
            next: updatedExpense => {
              this.displayMessage(
                'Gasto actualizado exitosamente'
              );
              this.editingId = null;
              this.resetForm();
              this.isLoading = false;
            },
            error: error => {
              console.error(
                'Error updating expense:',
                error
              );
              this.displayMessage(
                'Error al actualizar el gasto'
              );
              this.isLoading = false;
            },
          });
      } else {
        this.financialService
          .addExpense(formValue)
          .subscribe({
            next: newExpense => {
              this.displayMessage(
                'Gasto agregado exitosamente'
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
              console.error('Error adding expense:', error);
              this.displayMessage(
                'Error al agregar el gasto'
              );
              this.isLoading = false;
            },
          });
      }
    } else {
      this.markFormGroupTouched();
      this.displayMessage(
        'Por favor, complete todos los campos requeridos'
      );
    }
  }

  editExpense(expense: Expense): void {
    this.editingId = expense.id;
    this.expenseForm.patchValue({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      type: expense.type || ExpenseType.VARIABLE,
      date: new Date(expense.date),
      isFixed: expense.isFixed || false,
      isRecurring: expense.isRecurring || false,
    });
  }

  deleteExpense(id: string): void {
    if (
      confirm(
        '¿Está seguro de que desea eliminar este gasto?'
      )
    ) {
      this.financialService.deleteExpense(id).subscribe({
        next: () => {
          this.displayMessage(
            'Gasto eliminado exitosamente'
          );
        },
        error: error => {
          console.error('Error deleting expense:', error);
          this.displayMessage('Error al eliminar el gasto');
        },
      });
    }
  }

  resetForm(): void {
    this.expenseForm.reset({
      amount: '',
      description: '',
      category: ExpenseCategory.OTHER,
      type: ExpenseType.VARIABLE,
      date: new Date(),
      isFixed: false,
      isRecurring: false,
    });
    this.editingId = null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.expenseForm.controls).forEach(key => {
      const control = this.expenseForm.get(key);
      control?.markAsTouched();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement)
      .value;
    this.dataSource.filter = filterValue
      .trim()
      .toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private displayMessage(message: string): void {
    this.message = message;
    this.showMessageFlag = true;

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      this.showMessageFlag = false;
    }, 5000);

    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.expenseForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (control.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${control.errors['min'].min}`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldLabel(fieldName)} no puede exceder ${control.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      amount: 'La cantidad',
      description: 'La descripción',
      category: 'La categoría',
      type: 'El tipo',
      date: 'La fecha',
    };
    return labels[fieldName] || fieldName;
  }

  getCategoryLabel(category: ExpenseCategory): string {
    const cat = this.expenseCategories.find(
      c => c.value === category
    );
    return cat ? cat.label : 'Otros';
  }

  getTypeLabel(type: ExpenseType): string {
    const typeObj = this.expenseTypes.find(
      t => t.value === type
    );
    return typeObj ? typeObj.label : 'Variable';
  }

  getTotalExpenses(): number {
    return this.dataSource.data.reduce(
      (total: number, expense: Expense) =>
        total + expense.amount,
      0
    );
  }

  getCategoryIcon(category: ExpenseCategory): string {
    const iconMap: Record<ExpenseCategory, string> = {
      [ExpenseCategory.HOUSING]: 'home',
      [ExpenseCategory.FOOD]: 'restaurant',
      [ExpenseCategory.TRANSPORTATION]: 'directions_car',
      [ExpenseCategory.ENTERTAINMENT]: 'movie',
      [ExpenseCategory.HEALTHCARE]: 'local_hospital',
      [ExpenseCategory.EDUCATION]: 'school',
      [ExpenseCategory.SHOPPING]: 'shopping_bag',
      [ExpenseCategory.UTILITIES]: 'flash_on',
      [ExpenseCategory.OTHER]: 'more_horiz',
    };
    return iconMap[category] || 'more_horiz';
  }

  getTypeIcon(type: ExpenseType): string {
    const iconMap: Record<ExpenseType, string> = {
      [ExpenseType.FIXED]: 'push_pin',
      [ExpenseType.VARIABLE]: 'tune',
    };
    return iconMap[type] || 'tune';
  }

  scrollToForm(): void {
    const formElement = document.querySelector(
      '.expense-form-card'
    );
    if (formElement) {
      formElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
