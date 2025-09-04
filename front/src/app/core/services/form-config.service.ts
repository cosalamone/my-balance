import { Injectable } from '@angular/core';
import { ButtonConfig } from '../components/form/button/button.component';
import { DatepickerConfig } from '../components/form/datepicker/datepicker.component';
import {
  DropdownConfig,
  DropdownOption,
} from '../components/form/dropdown/dropdown.component';
import { TextInputConfig } from '../components/form/text-input/text-input.component';
import { TextareaConfig } from '../components/form/textarea/textarea.component';

@Injectable({
  providedIn: 'root',
})
export class FormConfigService {
  // Common input configurations
  getAmountInputConfig(): TextInputConfig {
    return {
      type: 'number',
      placeholder: 'Cantidad',
      icon: 'attach_money',
      required: true,
      min: 0,
      step: 0.01,
      prefixText: '$',
    };
  }

  getDescriptionInputConfig(
    maxLength = 500
  ): TextInputConfig {
    return {
      type: 'text',
      placeholder: 'Descripción',
      icon: 'description',
      required: true,
      maxLength,
    };
  }

  getDateInputConfig(
    placeholder = 'Fecha'
  ): DatepickerConfig {
    return {
      placeholder,
      required: true,
      hint: 'Selecciona la fecha',
      icon: 'calendar_today',
    };
  }

  getOptionalDateInputConfig(
    placeholder = 'Fecha Objetivo'
  ): DatepickerConfig {
    return {
      placeholder,
      required: false,
      hint: 'Opcional',
      icon: 'calendar_today',
    };
  }

  getEmailInputConfig(): TextInputConfig {
    return {
      type: 'email',
      placeholder: 'Correo electrónico',
      icon: 'email',
      required: true,
    };
  }

  getPasswordInputConfig(): TextInputConfig {
    return {
      type: 'password',
      placeholder: 'Contraseña',
      icon: 'lock',
      required: true,
    };
  }

  getTextAreaConfig(
    placeholder: string,
    rows = 3
  ): TextareaConfig {
    return {
      placeholder,
      rows,
      maxLength: 1000,
    };
  }

  // Category dropdown configs
  getIncomeCategoryDropdownConfig(): DropdownConfig {
    const options: DropdownOption[] = [
      { value: 'Salary', label: 'Salario', icon: 'work' },
      {
        value: 'Freelance',
        label: 'Freelance',
        icon: 'laptop',
      },
      {
        value: 'Investment',
        label: 'Inversión',
        icon: 'trending_up',
      },
      {
        value: 'Business',
        label: 'Negocio',
        icon: 'business',
      },
      { value: 'Rental', label: 'Alquiler', icon: 'home' },
      {
        value: 'Gift',
        label: 'Regalo',
        icon: 'card_giftcard',
      },
      {
        value: 'Other',
        label: 'Otros',
        icon: 'more_horiz',
      },
    ];

    return {
      placeholder: 'Categoría',
      options,
      required: true,
      icon: 'category',
    };
  }

  getExpenseCategoryDropdownConfig(): DropdownConfig {
    const options: DropdownOption[] = [
      {
        value: 'Food',
        label: 'Alimentación',
        icon: 'restaurant',
      },
      {
        value: 'Transport',
        label: 'Transporte',
        icon: 'directions_car',
      },
      { value: 'Housing', label: 'Vivienda', icon: 'home' },
      {
        value: 'Healthcare',
        label: 'Salud',
        icon: 'local_hospital',
      },
      {
        value: 'Entertainment',
        label: 'Entretenimiento',
        icon: 'movie',
      },
      {
        value: 'Shopping',
        label: 'Compras',
        icon: 'shopping_cart',
      },
      {
        value: 'Education',
        label: 'Educación',
        icon: 'school',
      },
      {
        value: 'Bills',
        label: 'Servicios',
        icon: 'receipt',
      },
      {
        value: 'Other',
        label: 'Otros',
        icon: 'more_horiz',
      },
    ];

    return {
      placeholder: 'Categoría',
      options,
      required: true,
      icon: 'category',
    };
  }

  getSavingsCategoryDropdownConfig(): DropdownConfig {
    const options: DropdownOption[] = [
      {
        value: 'EmergencyFund',
        label: 'Fondo de Emergencia',
        icon: 'security',
      },
      {
        value: 'Vacation',
        label: 'Vacaciones',
        icon: 'flight',
      },
      {
        value: 'Retirement',
        label: 'Jubilación',
        icon: 'elderly',
      },
      {
        value: 'Investment',
        label: 'Inversión',
        icon: 'trending_up',
      },
      {
        value: 'Goal',
        label: 'Meta Personal',
        icon: 'flag',
      },
      { value: 'Other', label: 'Otros', icon: 'savings' },
    ];

    return {
      placeholder: 'Categoría',
      options,
      required: true,
      icon: 'category',
    };
  }

  // Additional amount inputs
  getGoalAmountInputConfig(): TextInputConfig {
    return {
      type: 'number',
      placeholder: 'Meta de Ahorro',
      icon: 'flag',
      required: false,
      min: 0,
      step: 0.01,
      prefixText: '$',
      hint: 'Opcional - Establece una meta',
    };
  }

  // Search/Filter inputs
  getSearchInputConfig(
    placeholder = 'Buscar...'
  ): TextInputConfig {
    return {
      type: 'text',
      placeholder,
      icon: 'search',
      required: false,
    };
  }

  // Autocomplete dropdown config
  getAutocompleteDropdownConfig(
    options: DropdownOption[],
    placeholder: string
  ): DropdownConfig {
    return {
      placeholder,
      options,
      autocomplete: true,
      required: false,
      allowClear: true,
    };
  }

  // Button configurations
  getSaveButtonConfig(
    isEditing = false,
    isLoading = false
  ): ButtonConfig {
    return {
      label: isEditing ? 'Actualizar' : 'Guardar',
      icon: isEditing ? 'save' : 'add',
      type: 'primary',
      loading: isLoading,
      color: 'primary',
    };
  }

  getClearButtonConfig(isLoading = false): ButtonConfig {
    return {
      label: 'Limpiar',
      icon: 'clear',
      type: 'stroked',
      disabled: isLoading,
    };
  }

  getDeleteButtonConfig(isLoading = false): ButtonConfig {
    return {
      label: 'Eliminar',
      icon: 'delete',
      type: 'primary',
      color: 'warn',
      loading: isLoading,
    };
  }

  getEditButtonConfig(): ButtonConfig {
    return {
      label: '',
      icon: 'edit',
      type: 'icon',
      color: 'primary',
      tooltip: 'Editar',
    };
  }

  getDeleteIconButtonConfig(): ButtonConfig {
    return {
      label: '',
      icon: 'delete',
      type: 'icon',
      color: 'warn',
      tooltip: 'Eliminar',
    };
  }

  getCancelButtonConfig(): ButtonConfig {
    return {
      label: 'Cancelar',
      icon: 'close',
      type: 'stroked',
      tooltip: 'Cancelar edición',
    };
  }

  getAddButtonConfig(): ButtonConfig {
    return {
      label: 'Agregar',
      icon: 'add',
      type: 'primary',
      color: 'primary',
    };
  }
}
