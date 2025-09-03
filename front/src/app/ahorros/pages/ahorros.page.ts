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
  Savings,
  SavingsCategory,
} from '../../core/models/financial.models';
import { FinancialDataService } from '../../core/services/financial-data.service';

@Component({
  selector: 'mb-ahorros',
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
  templateUrl: './ahorros.page.html',
  styleUrls: ['./ahorros.page.scss'],
})
export class SavingsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  savingsForm!: FormGroup;
  savings$!: Observable<Savings[]>;
  dataSource = new MatTableDataSource<Savings>();
  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'amount',
    'goalAmount',
    'progress',
    'actions',
  ];

  savingsCategories = [
    {
      value: SavingsCategory.EMERGENCY_FUND,
      label: 'Fondo de Emergencia',
      icon: 'security',
    },
    {
      value: SavingsCategory.VACATION,
      label: 'Vacaciones',
      icon: 'flight',
    },
    {
      value: SavingsCategory.RETIREMENT,
      label: 'Jubilación',
      icon: 'elderly',
    },
    {
      value: SavingsCategory.INVESTMENT,
      label: 'Inversión',
      icon: 'trending_up',
    },
    {
      value: SavingsCategory.GOAL,
      label: 'Meta Personal',
      icon: 'flag',
    },
    {
      value: SavingsCategory.OTHER,
      label: 'Otros',
      icon: 'savings',
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
    this.loadSavings();
  }

  private initForm(): void {
    this.savingsForm = this.fb.group({
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
        SavingsCategory.OTHER,
        Validators.required,
      ],
      date: [new Date(), Validators.required],
      goalAmount: [''],
      targetDate: [''],
    });
  }

  private loadSavings(): void {
    // Load savings from server first
    this.financialService.getSavings().subscribe({
      next: savings => {
        console.log('Savings loaded from server:', savings);
      },
      error: error => {
        console.error('Error loading savings:', error);
        this.displayMessage('Error al cargar los ahorros');
      },
    });

    // Subscribe to the observable for reactive updates
    this.savings$ = this.financialService.savings$;
    this.financialService.savings$.subscribe(
      (savings: Savings[]) => {
        this.dataSource.data = savings.sort(
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
    if (this.savingsForm.valid) {
      this.isLoading = true;
      const formValue = {
        ...this.savingsForm.value,
        date: this.savingsForm.value.date || new Date(),
        goalAmount:
          this.savingsForm.value.goalAmount || null,
        targetDate:
          this.savingsForm.value.targetDate || null,
      };

      if (this.editingId !== null) {
        this.financialService
          .updateSaving(this.editingId, formValue)
          .subscribe({
            next: updatedSaving => {
              this.displayMessage(
                'Ahorro actualizado exitosamente'
              );
              this.resetForm();
            },
            error: error => {
              console.error(
                'Error updating saving:',
                error
              );
              this.displayMessage(
                'Error al actualizar el ahorro'
              );
              this.isLoading = false;
            },
          });
      } else {
        this.financialService
          .addSaving(formValue)
          .subscribe({
            next: newSaving => {
              this.displayMessage(
                'Ahorro agregado exitosamente'
              );
              this.resetForm();
              // Scroll to top to show the success message
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            },
            error: error => {
              console.error('Error adding saving:', error);
              this.displayMessage(
                'Error al agregar el ahorro'
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

  editSaving(saving: Savings): void {
    this.editingId = saving.id;
    this.savingsForm.patchValue({
      amount: saving.amount,
      description: saving.description,
      category: saving.category,
      date: new Date(saving.date),
      goalAmount: saving.goalAmount || '',
      targetDate: saving.targetDate
        ? new Date(saving.targetDate)
        : '',
    });
  }

  deleteSaving(id: string): void {
    if (
      confirm(
        '¿Está seguro de que desea eliminar este ahorro?'
      )
    ) {
      this.financialService.deleteSaving(id).subscribe({
        next: () => {
          this.displayMessage(
            'Ahorro eliminado exitosamente'
          );
        },
        error: error => {
          console.error('Error deleting saving:', error);
          this.displayMessage(
            'Error al eliminar el ahorro'
          );
        },
      });
    }
  }

  resetForm(): void {
    this.savingsForm.reset({
      amount: '',
      description: '',
      category: SavingsCategory.OTHER,
      date: new Date(),
      goalAmount: '',
      targetDate: '',
    });
    this.editingId = null;
    this.isLoading = false;

    // Mark all fields as untouched to remove validation errors
    this.savingsForm.markAsUntouched();
    this.savingsForm.markAsPristine();
    Object.keys(this.savingsForm.controls).forEach(key => {
      this.savingsForm.get(key)?.markAsUntouched();
      this.savingsForm.get(key)?.markAsPristine();
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.savingsForm.controls).forEach(key => {
      const control = this.savingsForm.get(key);
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
    const control = this.savingsForm.get(fieldName);
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
      date: 'La fecha',
      goalAmount: 'La meta de ahorro',
      targetDate: 'La fecha objetivo',
    };
    return labels[fieldName] || fieldName;
  }

  getCategoryLabel(category: SavingsCategory): string {
    const cat = this.savingsCategories.find(
      c => c.value === category
    );
    return cat ? cat.label : 'Otros';
  }

  getTotalSavings(): number {
    return this.dataSource.data.reduce(
      (total: number, saving: Savings) =>
        total + saving.amount,
      0
    );
  }

  getCategoryIcon(category: SavingsCategory): string {
    const iconMap: Record<SavingsCategory, string> = {
      [SavingsCategory.EMERGENCY_FUND]: 'security',
      [SavingsCategory.VACATION]: 'flight',
      [SavingsCategory.RETIREMENT]: 'elderly',
      [SavingsCategory.INVESTMENT]: 'trending_up',
      [SavingsCategory.GOAL]: 'flag',
      [SavingsCategory.OTHER]: 'savings',
    };
    return iconMap[category] || 'savings';
  }

  getProgress(saving: Savings): number {
    if (!saving.goalAmount || saving.goalAmount <= 0) {
      return 0;
    }
    return Math.min(
      (saving.amount / saving.goalAmount) * 100,
      100
    );
  }

  getProgressColor(progress: number): string {
    if (progress >= 100) return 'primary';
    if (progress >= 75) return 'accent';
    if (progress >= 50) return 'warn';
    return '';
  }

  scrollToForm(): void {
    const formElement = document.querySelector(
      '.savings-form-card'
    );
    if (formElement) {
      formElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
