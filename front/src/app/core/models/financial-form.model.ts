/**
 * Configuration models for the reusable FinancialFormTable component
 * Supports Income, Expense, and Savings management forms
 */

export interface SelectOption {
  value: string | number;
  label: string;
  icon: string;
}

/**
 * Configuration for dynamic form fields
 */
export interface FormFieldConfig {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  placeholder: string;
  icon: string;
  required: boolean;
  validators?: any[];
  options?: SelectOption[]; // For select fields
  hint?: string;
  cols?: number; // Grid columns (1 or 2 for responsive layout)
}

export interface TableColumnConfig {
  key: string;
  label: string;
  type:
    | 'text'
    | 'currency'
    | 'date'
    | 'category'
    | 'badge'
    | 'progress';
  width?: string;
  cssClass?: string;
  formatFn?: (value: any, row: any) => string; // Custom formatting
}

export interface FinancialFormTableConfig {
  // Metadata
  moduleType: 'income' | 'expense' | 'savings'; // Determines colors, icons, labels
  title: string;
  subtitle: string;
  headerIcon: string;
  noDataIcon: string;
  noDataTitle: string;
  noDataMessage: string;

  // Colors & Theming
  colorTheme: 'income' | 'expense' | 'savings'; // CSS class prefix (income-*, expense-*, savings-*)

  // Form configuration
  formFields: FormFieldConfig[];
  categoryOptions: SelectOption[];
  additionalSelectOptions?: {
    [fieldName: string]: SelectOption[];
  };

  // Table configuration
  displayedColumns: string[];
  tableColumns: TableColumnConfig[];

  // Button labels and icons
  formTitle: string;
  formTitleEdit: string;
  saveButtonLabel: string;
  clearButtonLabel: string;
  cancelButtonLabel: string;
  editButtonLabel: string;
  deleteButtonLabel: string;

  // Tips section
  tips: string[];

  // Table hints
  searchPlaceholder: string;
  historyTitle: string;
}

/**
 * Events emitted by the FinancialFormTable component
 */
export interface FormTableEvent<T> {
  action: 'save' | 'delete' | 'edit' | 'cancel' | 'clear';
  data?: T;
  id?: string | number;
}
