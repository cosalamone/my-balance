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
    MatSnackBarModule,
    FinancialFormTableComponent,
  ],
  templateUrl: './ahorros.page.html',
  styleUrls: ['./ahorros.page.scss'],
})
export class SavingsComponent implements OnInit {
  config = signal<FinancialFormTableConfig>(
    this.getConfig()
  );
  savings = signal<Savings[]>([]);
  isLoading = signal<boolean>(false);
  editingId = signal<string | null>(null);
  message = signal<string>('');

  constructor(
    private financialService: FinancialDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSavings();
  }

  private getConfig(): FinancialFormTableConfig {
    return {
      moduleType: 'savings',
      title: 'Gestión de Ahorros',
      subtitle:
        'Registra y administra tus ahorros y metas financieras',
      headerIcon: 'savings',
      noDataIcon: 'savings',
      noDataTitle: 'Sin ahorros registrados',
      noDataMessage:
        'Comienza agregando tu primer ahorro usando el formulario.',
      colorTheme: 'savings',
      formFields: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Cantidad*',
          icon: 'savings',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Describe tu ahorro...',
          icon: 'description',
          required: true,
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Fecha*',
          icon: '',
          required: true,
          hint: 'Seleccioná la fecha del ahorro',
        },
        {
          name: 'category',
          type: 'select',
          placeholder: 'Categoría*',
          icon: 'category',
          required: true,
        },
        {
          name: 'goalAmount',
          type: 'number',
          placeholder: 'Meta de Ahorro',
          icon: 'flag',
          required: false,
          hint: 'Opcional: Establece una meta',
        },
        {
          name: 'targetDate',
          type: 'date',
          placeholder: 'Fecha Objetivo',
          icon: '',
          required: false,
          hint: 'Opcional: Fecha límite para tu meta',
        },
      ],
      categoryOptions: [
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
      ],
      displayedColumns: [
        'date',
        'description',
        'category',
        'amount',
        'goalAmount',
        'progress',
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
        {
          key: 'goalAmount',
          label: 'Meta',
          type: 'currency',
        },
        {
          key: 'progress',
          label: 'Progreso',
          type: 'progress',
        },
        { key: 'date', label: 'Fecha', type: 'date' },
        { key: 'actions', label: 'Acciones', type: 'text' },
      ],
      formTitle: 'Nuevo Ahorro',
      formTitleEdit: 'Editar Ahorro',
      saveButtonLabel: 'Guardar',
      clearButtonLabel: 'Limpiar',
      cancelButtonLabel: 'Cancelar',
      editButtonLabel: 'Editar',
      deleteButtonLabel: 'Eliminar',
      tips: [
        'Define metas claras para cada ahorro',
        'Revisa tu progreso regularmente',
        'Mantén tus ahorros organizados por categoría',
      ],
      searchPlaceholder: 'Buscar por descripción...',
      historyTitle: 'Mis Ahorros',
    };
  }

  private loadSavings(): void {
    this.financialService.savings$.subscribe(
      (savings: Savings[]) => {
        this.savings.set(
          savings.sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          )
        );
      }
    );

    this.financialService.getSavings().subscribe({
      error: error => {
        console.error('Error loading savings:', error);
        this.showMessage('Error al cargar los ahorros');
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
        .updateSaving(this.editingId()!, formValue)
        .subscribe({
          next: () => {
            this.showMessage(
              'Ahorro actualizado exitosamente'
            );
            this.editingId.set(null);
            this.isLoading.set(false);
          },
          error: error => {
            console.error('Error updating saving:', error);
            this.showMessage(
              'Error al actualizar el ahorro'
            );
            this.isLoading.set(false);
          },
        });
    } else {
      this.financialService.addSaving(formValue).subscribe({
        next: () => {
          this.showMessage('Ahorro agregado exitosamente');
          this.isLoading.set(false);
        },
        error: error => {
          console.error('Error adding saving:', error);
          this.showMessage('Error al agregar el ahorro');
          this.isLoading.set(false);
        },
      });
    }
  }

  onDelete(id: string | number): void {
    this.financialService
      .deleteSaving(id as string)
      .subscribe({
        next: () => {
          this.showMessage('Ahorro eliminado exitosamente');
        },
        error: error => {
          console.error('Error deleting saving:', error);
          this.showMessage('Error al eliminar el ahorro');
        },
      });
  }

  onEdit(saving: Savings): void {
    this.editingId.set(saving.id);
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
