import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Income, IncomeCategory } from '../../core/models/financial.models';
import { FinancialDataService } from '../../core/services/financial-data.service';

@Injectable({
  providedIn: 'root',
})
export class IncomeHandlerService {
  constructor(private financialDataService: FinancialDataService) {}

  // Get all incomes
  getAllIncomes(): Observable<Income[]> {
    return this.financialDataService.incomes$;
  }

  // Get incomes by category
  getIncomesByCategory(category: IncomeCategory): Observable<Income[]> {
    return this.financialDataService.incomes$.pipe(
      map(incomes => incomes.filter(income => income.category === category))
    );
  }

  // Get incomes by date range
  getIncomesByDateRange(startDate: Date, endDate: Date): Observable<Income[]> {
    return this.financialDataService.incomes$.pipe(
      map(incomes =>
        incomes.filter(income => {
          const incomeDate = new Date(income.date);
          return incomeDate >= startDate && incomeDate <= endDate;
        })
      )
    );
  }

  // Get recurring incomes
  getRecurringIncomes(): Observable<Income[]> {
    return this.financialDataService.incomes$.pipe(
      map(incomes => incomes.filter(income => income.isRecurring))
    );
  }

  // Get monthly income total
  getMonthlyIncomeTotal(month: number, year: number): Observable<number> {
    return this.financialDataService.incomes$.pipe(
      map(incomes => {
        const monthlyIncomes = incomes.filter(income => {
          const date = new Date(income.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });
        return monthlyIncomes.reduce(
          (total, income) => total + income.amount,
          0
        );
      })
    );
  }

  // Get income statistics
  getIncomeStatistics(): Observable<{
    total: number;
    average: number;
    byCategory: { [key: string]: number };
    monthlyTrend: { month: string; amount: number }[];
  }> {
    return this.financialDataService.incomes$.pipe(
      map(incomes => {
        const total = incomes.reduce((sum, income) => sum + income.amount, 0);
        const average = incomes.length > 0 ? total / incomes.length : 0;

        // Group by category
        const byCategory: { [key: string]: number } = {};
        incomes.forEach(income => {
          byCategory[income.category] =
            (byCategory[income.category] || 0) + income.amount;
        });

        // Group by month for trend
        const monthlyData: { [key: string]: number } = {};
        incomes.forEach(income => {
          const date = new Date(income.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + income.amount;
        });

        const monthlyTrend = Object.keys(monthlyData)
          .sort()
          .slice(-12) // Last 12 months
          .map(key => ({
            month: key,
            amount: monthlyData[key],
          }));

        return {
          total,
          average,
          byCategory,
          monthlyTrend,
        };
      })
    );
  }

  // Add income
  addIncome(income: Omit<Income, 'id'>): void {
    this.financialDataService.addIncome(income);
  }

  // Update income
  updateIncome(id: string, updates: Partial<Income>): void {
    this.financialDataService.updateIncome(id, updates);
  }

  // Delete income
  deleteIncome(id: string): void {
    this.financialDataService.deleteIncome(id);
  }

  // Bulk operations
  addMultipleIncomes(incomes: Omit<Income, 'id'>[]): void {
    incomes.forEach(income => this.addIncome(income));
  }

  deleteMultipleIncomes(ids: string[]): void {
    ids.forEach(id => this.deleteIncome(id));
  }

  // Validation helpers
  validateIncomeData(income: Partial<Income>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!income.amount || income.amount <= 0) {
      errors.push('El monto debe ser mayor a 0');
    }

    if (!income.description || income.description.trim().length < 3) {
      errors.push('La descripción debe tener al menos 3 caracteres');
    }

    if (!income.category) {
      errors.push('La categoría es requerida');
    }

    if (!income.date) {
      errors.push('La fecha es requerida');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Export utilities
  exportToCSV(): Observable<string> {
    return this.financialDataService.incomes$.pipe(
      map(incomes => {
        const headers = [
          'Fecha',
          'Descripción',
          'Categoría',
          'Monto',
          'Recurrente',
        ];
        const csvContent = [
          headers.join(','),
          ...incomes.map(income =>
            [
              new Date(income.date).toLocaleDateString(),
              `"${income.description}"`,
              income.category,
              income.amount,
              income.isRecurring ? 'Sí' : 'No',
            ].join(',')
          ),
        ].join('\n');

        return csvContent;
      })
    );
  }
}
