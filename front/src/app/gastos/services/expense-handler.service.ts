import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  Expense,
  ExpenseCategory,
  ExpenseType,
} from '../../core/models/financial.models';
import { FinancialDataService } from '../../core/services/financial-data.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseHandlerService {
  constructor(
    private financialDataService: FinancialDataService
  ) {}

  // Add expense
  addExpense(
    expense: Omit<Expense, 'id'>
  ): Observable<Expense> {
    return this.financialDataService.addExpense(expense);
  }

  // Get all expenses
  getExpenses(): Observable<Expense[]> {
    return this.financialDataService.getExpenses();
  }

  // Update expense
  updateExpense(
    id: string,
    updates: Partial<Expense>
  ): Observable<Expense> {
    return this.financialDataService.updateExpense(
      id,
      updates
    );
  }

  // Delete expense
  deleteExpense(id: string): Observable<void> {
    return this.financialDataService.deleteExpense(id);
  }

  // Get expenses observable
  get expenses$(): Observable<Expense[]> {
    return this.financialDataService.expenses$;
  }

  // Get expense statistics
  getExpenseStatistics(): Observable<{
    total: number;
    average: number;
    byCategory: { [key: string]: number };
    byType: { [key: string]: number };
    monthlyTrend: { month: string; amount: number }[];
  }> {
    return this.financialDataService.expenses$.pipe(
      map(expenses => {
        const total = expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        const average =
          expenses.length > 0 ? total / expenses.length : 0;

        // Group by category
        const byCategory: { [key: string]: number } = {};
        expenses.forEach(expense => {
          byCategory[expense.category] =
            (byCategory[expense.category] || 0) +
            expense.amount;
        });

        // Group by type
        const byType: { [key: string]: number } = {};
        expenses.forEach(expense => {
          const type = expense.type || ExpenseType.VARIABLE;
          byType[type] =
            (byType[type] || 0) + expense.amount;
        });

        // Group by month for trend
        const monthlyData: { [key: string]: number } = {};
        expenses.forEach(expense => {
          const date = new Date(expense.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          monthlyData[monthKey] =
            (monthlyData[monthKey] || 0) + expense.amount;
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
          byType,
          monthlyTrend,
        };
      })
    );
  }

  // Get fixed expenses
  getFixedExpenses(): Observable<Expense[]> {
    return this.financialDataService.expenses$.pipe(
      map(expenses =>
        expenses.filter(
          expense =>
            expense.isFixed ||
            expense.type === ExpenseType.FIXED
        )
      )
    );
  }

  // Get variable expenses
  getVariableExpenses(): Observable<Expense[]> {
    return this.financialDataService.expenses$.pipe(
      map(expenses =>
        expenses.filter(
          expense =>
            !expense.isFixed &&
            expense.type === ExpenseType.VARIABLE
        )
      )
    );
  }

  // Get recurring expenses
  getRecurringExpenses(): Observable<Expense[]> {
    return this.financialDataService.expenses$.pipe(
      map(expenses =>
        expenses.filter(expense => expense.isRecurring)
      )
    );
  }

  // Get expenses by category
  getExpensesByCategory(
    category: ExpenseCategory
  ): Observable<Expense[]> {
    return this.financialDataService.expenses$.pipe(
      map(expenses =>
        expenses.filter(
          expense => expense.category === category
        )
      )
    );
  }

  // Get expenses by date range
  getExpensesByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<Expense[]> {
    return this.financialDataService.expenses$.pipe(
      map(expenses =>
        expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate >= startDate &&
            expenseDate <= endDate
          );
        })
      )
    );
  }

  // Get monthly expenses total
  getMonthlyExpensesTotal(
    month: number,
    year: number
  ): Observable<number> {
    return this.financialDataService.expenses$.pipe(
      map(expenses => {
        return expenses
          .filter(expense => {
            const date = new Date(expense.date);
            return (
              date.getMonth() === month &&
              date.getFullYear() === year
            );
          })
          .reduce(
            (sum, expense) => sum + expense.amount,
            0
          );
      })
    );
  }

  // Get current month expenses
  getCurrentMonthExpenses(): Observable<Expense[]> {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );

    return this.getExpensesByDateRange(
      startOfMonth,
      endOfMonth
    );
  }

  // Get expenses projection (based on fixed and recurring expenses)
  getMonthlyExpensesProjection(): Observable<number> {
    return this.getRecurringExpenses().pipe(
      map(expenses =>
        expenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        )
      )
    );
  }
}
