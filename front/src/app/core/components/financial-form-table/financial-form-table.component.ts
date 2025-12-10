import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  input,
  output,
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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatSort,
  MatSortModule,
} from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';

import { ButtonModelBase } from '../../models/button-base.model';
import {
  FinancialFormTableConfig,
  FormFieldConfig,
  SelectOption,
} from '../../models/financial-form.model';
import { ButtonCommonComponent } from '../buttons/common-button/common-button';

@Component({
  selector: 'mb-financial-form-table',
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
    MatOptionModule,
    ButtonCommonComponent,
  ],
  templateUrl: './financial-form-table.component.html',
  styleUrls: ['./financial-form-table.component.scss'],
})
export class FinancialFormTableComponent<T>
  implements OnInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  config = input.required<FinancialFormTableConfig>();
  data = input.required<T[]>();
  isLoading = input<boolean>(false);
  editingId = input<string | null>(null);
  message = input<string>('');

  save = output<{ form: FormGroup; isEdit: boolean }>();
  delete = output<string | number>();
  edit = output<T>();
  cancel = output<void>();
  clear = output<void>();
  filter = output<string>();

  form!: FormGroup;
  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  saveButtonModel!: ButtonModelBase;
  clearButtonModel!: ButtonModelBase;
  cancelEditModel!: ButtonModelBase;
  editRowButtonModel!: ButtonModelBase;
  deleteRowButtonModel!: ButtonModelBase;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    effect(() => {
      this.dataSource.data = this.data();
      this.updatePaginatorAndSort();
    });

    effect(() => {
      this.displayedColumns =
        this.config().displayedColumns;
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeButtonModels();
  }

  ngAfterViewInit(): void {
    this.updatePaginatorAndSort();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const group: { [key: string]: any } = {};

    this.config().formFields.forEach(
      (field: FormFieldConfig) => {
        const validators = field.required
          ? [Validators.required]
          : [];
        if (field.validators) {
          validators.push(...field.validators);
        }
        group[field.name] = ['', validators];
      }
    );

    this.form = this.fb.group(group);
  }

  private initializeButtonModels(): void {
    const cfg = this.config();

    this.saveButtonModel = new ButtonModelBase({
      style: 'filled',
      label: cfg.saveButtonLabel,
      iconName: 'save',
      action: () => this.onSubmit(),
    });

    this.clearButtonModel = new ButtonModelBase({
      style: 'outlined',
      label: cfg.clearButtonLabel,
      iconName: 'clear',
      action: () => this.onClear(),
    });

    this.cancelEditModel = new ButtonModelBase({
      style: 'outlined',
      label: cfg.cancelButtonLabel,
      iconName: 'close',
      action: () => this.onCancel(),
    });

    this.editRowButtonModel = new ButtonModelBase({
      style: 'icon',
      iconName: 'edit',
      action: (data: T) => this.onEditRow(data),
    });

    this.deleteRowButtonModel = new ButtonModelBase({
      style: 'icon',
      iconName: 'delete',
      action: (id: string | number) => this.onDeleteRow(id),
    });
  }

  private updatePaginatorAndSort(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const isEdit = !!this.editingId();
      this.save.emit({ form: this.form, isEdit });
    }
  }

  onClear(): void {
    this.form.reset();
    this.clear.emit();
  }

  onCancel(): void {
    this.form.reset();
    this.cancel.emit();
  }

  onEditRow(data: T): void {
    this.edit.emit(data);
  }

  onDeleteRow(id: string | number): void {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar este registro?'
      )
    ) {
      this.delete.emit(id);
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement)
      .value;
    this.dataSource.filter = filterValue
      .trim()
      .toLowerCase();
    this.filter.emit(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    return '';
  }

  getCategoryIcon(category: string): string {
    const categoryOpt = this.config().categoryOptions.find(
      opt => opt.value === category
    );
    return categoryOpt?.icon || 'category';
  }

  getCategoryLabel(category: string): string {
    const categoryOpt = this.config().categoryOptions.find(
      opt => opt.value === category
    );
    return categoryOpt?.label || category;
  }

  getSelectOptions(fieldName: string): SelectOption[] {
    if (fieldName === 'category') {
      return this.config().categoryOptions;
    }
    const additionalOptions =
      this.config().additionalSelectOptions?.[fieldName];
    return additionalOptions || [];
  }

  isFormInvalid(): boolean {
    return this.form.invalid || this.isLoading();
  }

  getProgressPercentage(element: any): number {
    if (!element.goalAmount || element.goalAmount === 0) {
      return 0;
    }
    const percentage =
      (element.amount / element.goalAmount) * 100;
    return Math.min(100, Math.round(percentage));
  }

  getTotalAmount(): number {
    return this.dataSource.data.reduce(
      (total: number, item: any) => {
        return total + (item.amount || 0);
      },
      0
    );
  }
}
