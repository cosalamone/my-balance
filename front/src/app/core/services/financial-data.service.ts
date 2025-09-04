import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  Expense,
  FinancialSummary,
  Income,
  Savings,
} from '../models/financial.models';
import { AuthService } from './auth.service';

export interface DashboardSummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  balance: number;
  currentMonth: {
    income: number;
    expenses: number;
    savings: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
    savings: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FinancialDataService {
  private readonly API_URL = 'http://localhost:5019/api';

  private incomesSubject = new BehaviorSubject<Income[]>(
    []
  );
  private expensesSubject = new BehaviorSubject<Expense[]>(
    []
  );
  private savingsSubject = new BehaviorSubject<Savings[]>(
    []
  );

  public incomes$ = this.incomesSubject.asObservable();
  public expenses$ = this.expensesSubject.asObservable();
  public savings$ = this.savingsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Initialize with empty data, will be loaded when user logs in
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
  }

  // Dashboard Summary
  getDashboardSummary(): Observable<DashboardSummaryResponse> {
    return this.http.get<DashboardSummaryResponse>(
      `${this.API_URL}/dashboard/summary`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Income methods
  addIncome(
    income: Omit<Income, 'id'>
  ): Observable<Income> {
    return this.http
      .post<Income>(`${this.API_URL}/income`, income, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(newIncome => {
          const currentIncomes = this.incomesSubject.value;
          this.incomesSubject.next([
            ...currentIncomes,
            newIncome,
          ]);
        })
      );
  }

  getIncomes(): Observable<Income[]> {
    return this.http
      .get<
        Income[]
      >(`${this.API_URL}/income`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(incomes => {
          this.incomesSubject.next(incomes);
        })
      );
  }

  updateIncome(
    id: string,
    updates: Partial<Income>
  ): Observable<Income> {
    return this.http
      .put<Income>(
        `${this.API_URL}/income/${id}`,
        updates,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        tap(updatedIncome => {
          const currentIncomes = this.incomesSubject.value;
          const updatedIncomes = currentIncomes.map(
            income =>
              income.id === updatedIncome.id
                ? updatedIncome
                : income
          );
          this.incomesSubject.next(updatedIncomes);
        })
      );
  }

  deleteIncome(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/income/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(() => {
          const currentIncomes = this.incomesSubject.value;
          const updatedIncomes = currentIncomes.filter(
            income => income.id !== id
          );
          this.incomesSubject.next(updatedIncomes);
        })
      );
  }

  // Expense methods
  addExpense(
    expense: Omit<Expense, 'id'>
  ): Observable<Expense> {
    return this.http
      .post<Expense>(`${this.API_URL}/expenses`, expense, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(newExpense => {
          const currentExpenses =
            this.expensesSubject.value;
          this.expensesSubject.next([
            ...currentExpenses,
            newExpense,
          ]);
        })
      );
  }

  getExpenses(): Observable<Expense[]> {
    return this.http
      .get<
        Expense[]
      >(`${this.API_URL}/expenses`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(expenses => {
          this.expensesSubject.next(expenses);
        })
      );
  }

  updateExpense(
    id: string,
    updates: Partial<Expense>
  ): Observable<Expense> {
    return this.http
      .put<Expense>(
        `${this.API_URL}/expenses/${id}`,
        updates,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        tap(updatedExpense => {
          const currentExpenses =
            this.expensesSubject.value;
          const updatedExpenses = currentExpenses.map(
            expense =>
              expense.id === id ? updatedExpense : expense
          );
          this.expensesSubject.next(updatedExpenses);
        })
      );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/expenses/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(() => {
          const currentExpenses =
            this.expensesSubject.value;
          const updatedExpenses = currentExpenses.filter(
            expense => expense.id !== id
          );
          this.expensesSubject.next(updatedExpenses);
        })
      );
  }

  // Savings methods
  addSaving(
    saving: Omit<Savings, 'id'>
  ): Observable<Savings> {
    return this.http
      .post<Savings>(`${this.API_URL}/savings`, saving, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(newSaving => {
          const currentSavings = this.savingsSubject.value;
          this.savingsSubject.next([
            ...currentSavings,
            newSaving,
          ]);
        })
      );
  }

  getSavings(): Observable<Savings[]> {
    return this.http
      .get<
        Savings[]
      >(`${this.API_URL}/savings`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(savings => {
          this.savingsSubject.next(savings);
        })
      );
  }

  updateSaving(
    id: string,
    updates: Partial<Savings>
  ): Observable<Savings> {
    return this.http
      .put<Savings>(
        `${this.API_URL}/savings/${id}`,
        updates,
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(
        tap(updatedSaving => {
          const currentSavings = this.savingsSubject.value;
          const updatedSavings = currentSavings.map(
            saving =>
              saving.id === id ? updatedSaving : saving
          );
          this.savingsSubject.next(updatedSavings);
        })
      );
  }

  deleteSaving(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/savings/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap(() => {
          const currentSavings = this.savingsSubject.value;
          const updatedSavings = currentSavings.filter(
            saving => saving.id !== id
          );
          this.savingsSubject.next(updatedSavings);
        })
      );
  }

  // Local methods for compatibility
  getMonthlyData(
    month: number,
    year: number
  ): FinancialSummary {
    const incomes = this.incomesSubject.value.filter(
      income => {
        const date = new Date(income.date);
        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }
    );

    const expenses = this.expensesSubject.value.filter(
      expense => {
        const date = new Date(expense.date);
        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }
    );

    const savings = this.savingsSubject.value.filter(
      saving => {
        const date = new Date(saving.date);
        return (
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }
    );

    const totalIncome = incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const totalSavings = savings.reduce(
      (sum, saving) => sum + saving.amount,
      0
    );

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      balance: totalIncome - totalExpenses - totalSavings,
      currentMonth: {
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalSavings,
      },
      previousMonth: {
        income: 0,
        expenses: 0,
        savings: 0,
      },
    };
  }

  getCurrentMonthSummary(): FinancialSummary {
    const now = new Date();
    return this.getMonthlyData(
      now.getMonth(),
      now.getFullYear()
    );
  }

  // Load all data for current user
  loadUserData(): void {
    if (this.authService.isLoggedIn()) {
      this.getIncomes().subscribe();
      this.getExpenses().subscribe();
      this.getSavings().subscribe();
    }
  }

  // Clear data on logout
  clearData(): void {
    this.incomesSubject.next([]);
    this.expensesSubject.next([]);
    this.savingsSubject.next([]);
  }
}
