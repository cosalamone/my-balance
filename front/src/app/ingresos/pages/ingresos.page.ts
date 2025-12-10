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
    MatSnackBarModule,
    FinancialFormTableComponent,
  ],
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
})
export class IncomeComponent implements OnInit {
  config = signal<FinancialFormTableConfig>(
    this.getConfig()
  );
  incomes = signal<Income[]>([]);
  isLoading = signal<boolean>(false);
  editingId = signal<string | null>(null);
  message = signal<string>('');

  constructor(
    private financialService: FinancialDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  private getConfig(): FinancialFormTableConfig {
    return {
      moduleType: 'income',
      title: 'Gestión de Ingresos',
      subtitle:
        'Registra y administra tus fuentes de ingresos',
      headerIcon: 'trending_up',
      noDataIcon: 'trending_up',
      noDataTitle: 'Sin ingresos registrados',
      noDataMessage:
        'Comienza agregando tu primer ingreso usando el formulario.',
      colorTheme: 'income',
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
          placeholder: 'Describe tu ingreso...',
          icon: 'description',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Fecha*',
          icon: '',
          required: true,
          hint: 'Seleccioná la fecha del ingreso',
        },
        {
          name: 'category',
          type: 'select',
          placeholder: 'Categoría*',
          icon: 'category',
          required: true,
        },
        {
          name: 'source',
          type: 'select',
          placeholder: 'Fuente*',
          icon: 'source',
          required: true,
        },
      ],
      categoryOptions: [
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
      ],
      additionalSelectOptions: {
        source: [
          {
            value: 'bank_transfer',
            label: 'Transferencia Bancaria',
            icon: 'account_balance',
          },
          {
            value: 'cash',
            label: 'Efectivo',
            icon: 'local_atm',
          },
          {
            value: 'check',
            label: 'Cheque',
            icon: 'receipt',
          },
          {
            value: 'digital_wallet',
            label: 'Billetera Digital',
            icon: 'account_balance_wallet',
          },
          {
            value: 'other',
            label: 'Otro',
            icon: 'more_horiz',
          },
        ],
      },
      displayedColumns: [
        'date',
        'description',
        'category',
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
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'actions', label: 'Acciones', type: 'text' },
      ],
      formTitle: 'Nuevo Ingreso',
      formTitleEdit: 'Editar Ingreso',
      saveButtonLabel: 'Guardar',
      clearButtonLabel: 'Limpiar',
      cancelButtonLabel: 'Cancelar',
      editButtonLabel: 'Editar',
      deleteButtonLabel: 'Eliminar',
      tips: [
        'Registra todos tus ingresos para un mejor control',
        'Usa descripciones claras y específicas',
        'Mantén actualizada la categoría y fuente',
      ],
      searchPlaceholder: 'Buscar por descripción...',
      historyTitle: 'Historial de Ingresos',
    };
  }

  private loadIncomes(): void {
    this.financialService.incomes$.subscribe(
      (incomes: Income[]) => {
        this.incomes.set(
          incomes.sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          )
        );
      }
    );

    this.financialService.getIncomes().subscribe({
      error: error => {
        console.error('Error loading incomes:', error);
        this.showMessage('Error al cargar los ingresos');
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
    };

    if (event.isEdit && this.editingId()) {
      this.financialService
        .updateIncome(this.editingId()!, formValue)
        .subscribe({
          next: () => {
            this.showMessage(
              'Ingreso actualizado exitosamente'
            );
            this.editingId.set(null);
            this.isLoading.set(false);
          },
          error: error => {
            console.error('Error updating income:', error);
            this.showMessage(
              'Error al actualizar el ingreso'
            );
            this.isLoading.set(false);
          },
        });
    } else {
      this.financialService.addIncome(formValue).subscribe({
        next: () => {
          this.showMessage('Ingreso agregado exitosamente');
          this.isLoading.set(false);
        },
        error: error => {
          console.error('Error adding income:', error);
          this.showMessage('Error al agregar el ingreso');
          this.isLoading.set(false);
        },
      });
    }
  }

  onDelete(id: string | number): void {
    this.financialService
      .deleteIncome(id as string)
      .subscribe({
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

  onEdit(income: Income): void {
    this.editingId.set(income.id);
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
