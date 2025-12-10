import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { FinancialFormTableComponent } from '../../core/components/financial-form-table/financial-form-table.component';
import { FinancialFormTableConfig } from '../../core/models/financial-form.model';
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
    MatSnackBarModule,
    FinancialFormTableComponent,
  ],
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class ExpenseComponent implements OnInit {
  config = signal<FinancialFormTableConfig>(
    this.getConfig()
  );
  expenses = signal<Expense[]>([]);
  isLoading = signal<boolean>(false);
  editingId = signal<string | null>(null);
  message = signal<string>('');

  constructor(
    private financialService: FinancialDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  private getConfig(): FinancialFormTableConfig {
    return {
      moduleType: 'expense',
      title: 'Gestión de Gastos',
      subtitle:
        'Registra y administra tus gastos y egresos',
      headerIcon: 'remove_circle_outline',
      noDataIcon: 'shopping_bag',
      noDataTitle: 'Sin gastos registrados',
      noDataMessage:
        'Comienza agregando tu primer gasto usando el formulario.',
      colorTheme: 'expense',
      formFields: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Cantidad*',
          icon: 'payments',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Describe tu gasto...',
          icon: 'description',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Fecha*',
          icon: '',
          required: true,
          hint: 'Selecciona la fecha del gasto',
        },
        {
          name: 'category',
          type: 'select',
          placeholder: 'Categoría*',
          icon: 'category',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          placeholder: 'Tipo de Gasto*',
          icon: 'tune',
          required: true,
        },
      ],
      categoryOptions: [
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
      ],
      additionalSelectOptions: {
        type: [
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
        ],
      },
      displayedColumns: [
        'date',
        'description',
        'category',
        'type',
        'amount',
        'actions',
      ],
      tableColumns: [
        {
          key: 'amount',
          label: 'Cantidad',
          type: 'currency',
        },
        {
          key: 'description',
          label: 'Descripción',
          type: 'text',
        },
        {
          key: 'category',
          label: 'Categoría',
          type: 'category',
        },
        { key: 'type', label: 'Tipo', type: 'badge' },
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'actions', label: 'Acciones', type: 'text' },
      ],
      formTitle: 'Nuevo Gasto',
      formTitleEdit: 'Editar Gasto',
      saveButtonLabel: 'Guardar',
      clearButtonLabel: 'Limpiar',
      cancelButtonLabel: 'Cancelar',
      editButtonLabel: 'Editar',
      deleteButtonLabel: 'Eliminar',
      tips: [
        'Registra todos tus gastos para un mejor control',
        'Categoriza correctamente para análisis precisos',
        'Usa descripciones claras y específicas',
      ],
      searchPlaceholder: 'Buscar por descripción...',
      historyTitle: 'Mis Gastos',
    };
  }

  private loadExpenses(): void {
    this.financialService.expenses$.subscribe(
      (expenses: Expense[]) => {
        this.expenses.set(
          expenses.sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          )
        );
      }
    );

    this.financialService.getExpenses().subscribe({
      error: error => {
        console.error('Error loading expenses:', error);
        this.showMessage('Error al cargar los gastos');
      },
    });
  }

  onSave(event: {
    form: FormGroup;
    isEdit: boolean;
  }): void {
    this.isLoading.set(true);
    const formValue = {
      ...event.form.value,
      date: event.form.value.date || new Date(),
      isFixed: event.form.value.type === ExpenseType.FIXED,
    };

    if (event.isEdit && this.editingId()) {
      this.financialService
        .updateExpense(this.editingId()!, formValue)
        .subscribe({
          next: () => {
            this.showMessage(
              'Gasto actualizado exitosamente'
            );
            this.editingId.set(null);
            this.isLoading.set(false);
          },
          error: error => {
            console.error('Error updating expense:', error);
            this.showMessage(
              'Error al actualizar el gasto'
            );
            this.isLoading.set(false);
          },
        });
    } else {
      this.financialService
        .addExpense(formValue)
        .subscribe({
          next: () => {
            this.showMessage('Gasto agregado exitosamente');
            this.isLoading.set(false);
          },
          error: error => {
            console.error('Error adding expense:', error);
            this.showMessage('Error al agregar el gasto');
            this.isLoading.set(false);
          },
        });
    }
  }

  onDelete(id: string | number): void {
    this.financialService
      .deleteExpense(id as string)
      .subscribe({
        next: () => {
          this.showMessage('Gasto eliminado exitosamente');
        },
        error: error => {
          console.error('Error deleting expense:', error);
          this.showMessage('Error al eliminar el gasto');
        },
      });
  }

  onEdit(expense: Expense): void {
    this.editingId.set(expense.id);
  }

  onCancel(): void {
    this.editingId.set(null);
  }

  onClear(): void {
    this.editingId.set(null);
  }

  private showMessage(message: string): void {
    this.message.set(message);
    setTimeout(() => {
      this.message.set('');
    }, 5000);

    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
