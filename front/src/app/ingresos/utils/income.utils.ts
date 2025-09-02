import { IncomeCategory } from '../../core/models/financial.models';

export class IncomeUtils {
  static getCategoryIcon(category: IncomeCategory): string {
    const iconMap: Record<IncomeCategory, string> = {
      [IncomeCategory.SALARY]: 'work',
      [IncomeCategory.BONUS]: 'star',
      [IncomeCategory.FREELANCE]: 'laptop',
      [IncomeCategory.INVESTMENT]: 'trending_up',
      [IncomeCategory.GIFT]: 'card_giftcard',
      [IncomeCategory.AGUINALDO]: 'payments',
      [IncomeCategory.OTHER]: 'more_horiz',
    };

    return iconMap[category] || 'more_horiz';
  }

  static getCategoryColor(
    category: IncomeCategory
  ): string {
    const colorMap: Record<IncomeCategory, string> = {
      [IncomeCategory.SALARY]: 'text-green-600',
      [IncomeCategory.BONUS]: 'text-yellow-600',
      [IncomeCategory.FREELANCE]: 'text-purple-600',
      [IncomeCategory.INVESTMENT]: 'text-blue-600',
      [IncomeCategory.GIFT]: 'text-pink-600',
      [IncomeCategory.AGUINALDO]: 'text-indigo-600',
      [IncomeCategory.OTHER]: 'text-gray-600',
    };

    return colorMap[category] || 'text-gray-600';
  }

  static getCategoryBadgeClass(
    category: IncomeCategory
  ): string {
    const badgeMap: Record<IncomeCategory, string> = {
      [IncomeCategory.SALARY]:
        'bg-green-100 text-green-800',
      [IncomeCategory.BONUS]:
        'bg-yellow-100 text-yellow-800',
      [IncomeCategory.FREELANCE]:
        'bg-purple-100 text-purple-800',
      [IncomeCategory.INVESTMENT]:
        'bg-blue-100 text-blue-800',
      [IncomeCategory.GIFT]: 'bg-pink-100 text-pink-800',
      [IncomeCategory.AGUINALDO]:
        'bg-indigo-100 text-indigo-800',
      [IncomeCategory.OTHER]: 'bg-gray-100 text-gray-800',
    };

    return (
      badgeMap[category] || 'bg-gray-100 text-gray-800'
    );
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatDate(date: Date | string): string {
    const dateObj =
      typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  }

  static calculateMonthlyAverage(
    incomes: any[],
    months: number = 12
  ): number {
    if (incomes.length === 0) return 0;

    const total = incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    return total / months;
  }

  static getMonthlyProjection(incomes: any[]): number {
    const recurringIncomes = incomes.filter(
      income => income.isRecurring
    );
    return recurringIncomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
  }

  static validateAmount(amount: number): {
    isValid: boolean;
    message?: string;
  } {
    if (isNaN(amount) || amount <= 0) {
      return {
        isValid: false,
        message: 'El monto debe ser un número mayor a 0',
      };
    }

    if (amount > 999999999) {
      return {
        isValid: false,
        message: 'El monto es demasiado alto',
      };
    }

    return { isValid: true };
  }

  static validateDescription(description: string): {
    isValid: boolean;
    message?: string;
  } {
    if (!description || description.trim().length === 0) {
      return {
        isValid: false,
        message: 'La descripción es requerida',
      };
    }

    if (description.trim().length < 3) {
      return {
        isValid: false,
        message:
          'La descripción debe tener al menos 3 caracteres',
      };
    }

    if (description.length > 100) {
      return {
        isValid: false,
        message:
          'La descripción no puede exceder 100 caracteres',
      };
    }

    return { isValid: true };
  }

  static generateIncomeId(): string {
    return (
      'income_' +
      Math.random().toString(36).substr(2, 9) +
      '_' +
      Date.now()
    );
  }

  static sortIncomesByDate(
    incomes: any[],
    ascending: boolean = false
  ): any[] {
    return [...incomes].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  static groupIncomesByCategory(
    incomes: any[]
  ): Record<string, any[]> {
    return incomes.reduce((groups, income) => {
      const category = income.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(income);
      return groups;
    }, {});
  }

  static exportIncomeToCSV(incomes: any[]): string {
    const headers = [
      'Fecha',
      'Descripción',
      'Categoría',
      'Monto',
      'Recurrente',
    ];
    const csvRows = [
      headers.join(','),
      ...incomes.map(income =>
        [
          this.formatDate(income.date),
          `"${income.description.replace(/"/g, '""')}"`, // Escape quotes
          income.category,
          income.amount.toString(),
          income.isRecurring ? 'Sí' : 'No',
        ].join(',')
      ),
    ];

    return csvRows.join('\n');
  }

  static downloadCSV(
    csvContent: string,
    filename: string = 'ingresos.csv'
  ): void {
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
