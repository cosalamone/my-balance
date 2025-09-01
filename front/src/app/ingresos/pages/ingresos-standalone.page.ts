import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FinancialDataService } from '../../core/services/financial-data.service';
import { Income, IncomeCategory } from '../../core/models/financial.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ingresos',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss']
})
export class IncomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  incomeForm!: FormGroup;
  incomes$!: Observable<Income[]>;
  dataSource = new MatTableDataSource<Income>();
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];

  incomeCategories = [
    { value: IncomeCategory.SALARY, label: 'Haberes' },
    { value: IncomeCategory.BONUS, label: 'Bonos' },
    { value: IncomeCategory.GIFT, label: 'Regalos' },
    { value: IncomeCategory.AGUINALDO, label: 'Aguinaldo' },
    { value: IncomeCategory.OTHER, label: 'Otros' }
  ];

  isLoading = false;
  editingId: string | null = null;

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
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      category: [IncomeCategory.SALARY, Validators.required],
      date: [new Date(), Validators.required],
      isRecurring: [false]
    });
  }

  private loadIncomes(): void {
    this.incomes$ = this.financialService.incomes$;
    this.financialService.incomes$.subscribe((incomes: Income[]) => {
      this.dataSource.data = incomes.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onSubmit(): void {
    if (this.incomeForm.valid) {
      this.isLoading = true;
      const formValue = this.incomeForm.value;

      if (this.editingId) {
        this.financialService.updateIncome(this.editingId, formValue);
        this.showMessage('Ingreso actualizado exitosamente');
        this.editingId = null;
      } else {
        this.financialService.addIncome(formValue);
        this.showMessage('Ingreso agregado exitosamente');
      }

      this.incomeForm.reset();
      this.initForm();
      this.isLoading = false;
    }
  }

  editIncome(income: Income): void {
    this.editingId = income.id;
    this.incomeForm.patchValue({
      amount: income.amount,
      description: income.description,
      category: income.category,
      date: new Date(income.date),
      isRecurring: income.isRecurring || false
    });
  }

  deleteIncome(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este ingreso?')) {
      this.financialService.deleteIncome(id);
      this.showMessage('Ingreso eliminado exitosamente');
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.incomeForm.reset();
    this.initForm();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getCategoryLabel(category: IncomeCategory): string {
    const cat = this.incomeCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  getTotalIncome(): number {
    return this.dataSource.data.reduce((total: number, income: Income) => total + income.amount, 0);
  }
}