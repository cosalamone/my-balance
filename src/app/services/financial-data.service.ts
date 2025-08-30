import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Income, 
  Expense, 
  Savings, 
  FinancialSummary,
  IncomeCategory,
  ExpenseCategory,
  SavingsCategory,
  ExpenseType
} from '../models/financial.models';

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {
  private incomesSubject = new BehaviorSubject<Income[]>([]);
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  private savingsSubject = new BehaviorSubject<Savings[]>([]);

  public incomes$ = this.incomesSubject.asObservable();
  public expenses$ = this.expensesSubject.asObservable();
  public savings$ = this.savingsSubject.asObservable();

  constructor() {
    this.loadDataFromStorage();
  }

  // Income methods
  addIncome(income: Omit<Income, 'id'>): void {
    const newIncome: Income = {
      ...income,
      id: this.generateId()
    };
    
    const currentIncomes = this.incomesSubject.value;
    const updatedIncomes = [...currentIncomes, newIncome];
    
    this.incomesSubject.next(updatedIncomes);
    this.saveToStorage('incomes', updatedIncomes);
  }

  updateIncome(id: string, updates: Partial<Income>): void {
    const currentIncomes = this.incomesSubject.value;
    const updatedIncomes = currentIncomes.map(income => 
      income.id === id ? { ...income, ...updates } : income
    );
    
    this.incomesSubject.next(updatedIncomes);
    this.saveToStorage('incomes', updatedIncomes);
  }

  deleteIncome(id: string): void {
    const currentIncomes = this.incomesSubject.value;
    const updatedIncomes = currentIncomes.filter(income => income.id !== id);
    
    this.incomesSubject.next(updatedIncomes);
    this.saveToStorage('incomes', updatedIncomes);
  }

  // Expense methods
  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = {
      ...expense,
      id: this.generateId()
    };
    
    const currentExpenses = this.expensesSubject.value;
    const updatedExpenses = [...currentExpenses, newExpense];
    
    this.expensesSubject.next(updatedExpenses);
    this.saveToStorage('expenses', updatedExpenses);
  }

  updateExpense(id: string, updates: Partial<Expense>): void {
    const currentExpenses = this.expensesSubject.value;
    const updatedExpenses = currentExpenses.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    );
    
    this.expensesSubject.next(updatedExpenses);
    this.saveToStorage('expenses', updatedExpenses);
  }

  deleteExpense(id: string): void {
    const currentExpenses = this.expensesSubject.value;
    const updatedExpenses = currentExpenses.filter(expense => expense.id !== id);
    
    this.expensesSubject.next(updatedExpenses);
    this.saveToStorage('expenses', updatedExpenses);
  }

  // Savings methods
  addSaving(saving: Omit<Savings, 'id'>): void {
    const newSaving: Savings = {
      ...saving,
      id: this.generateId()
    };
    
    const currentSavings = this.savingsSubject.value;
    const updatedSavings = [...currentSavings, newSaving];
    
    this.savingsSubject.next(updatedSavings);
    this.saveToStorage('savings', updatedSavings);
  }

  updateSaving(id: string, updates: Partial<Savings>): void {
    const currentSavings = this.savingsSubject.value;
    const updatedSavings = currentSavings.map(saving => 
      saving.id === id ? { ...saving, ...updates } : saving
    );
    
    this.savingsSubject.next(updatedSavings);
    this.saveToStorage('savings', updatedSavings);
  }

  deleteSaving(id: string): void {
    const currentSavings = this.savingsSubject.value;
    const updatedSavings = currentSavings.filter(saving => saving.id !== id);
    
    this.savingsSubject.next(updatedSavings);
    this.saveToStorage('savings', updatedSavings);
  }

  // Summary methods
  getMonthlyData(month: number, year: number): FinancialSummary {
    const incomes = this.incomesSubject.value.filter(income => {
      const date = new Date(income.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const expenses = this.expensesSubject.value.filter(expense => {
      const date = new Date(expense.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const savings = this.savingsSubject.value.filter(saving => {
      const date = new Date(saving.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalSavings = savings.reduce((sum, saving) => sum + saving.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      netBalance: totalIncome - totalExpenses - totalSavings,
      month,
      year
    };
  }

  getCurrentMonthSummary(): FinancialSummary {
    const now = new Date();
    return this.getMonthlyData(now.getMonth(), now.getFullYear());
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveToStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadDataFromStorage(): void {
    const incomes = localStorage.getItem('incomes');
    const expenses = localStorage.getItem('expenses');
    const savings = localStorage.getItem('savings');

    if (incomes) {
      this.incomesSubject.next(JSON.parse(incomes));
    }
    if (expenses) {
      this.expensesSubject.next(JSON.parse(expenses));
    }
    if (savings) {
      this.savingsSubject.next(JSON.parse(savings));
    }
  }

  // Sample data for demo
  loadSampleData(): void {
    const sampleIncomes: Income[] = [
      {
        id: '1',
        amount: 150000,
        description: 'Salario Mensual',
        category: IncomeCategory.SALARY,
        date: new Date(),
        isRecurring: true
      },
      {
        id: '2',
        amount: 25000,
        description: 'Bonus Trimestral',
        category: IncomeCategory.BONUS,
        date: new Date(),
        isRecurring: false
      }
    ];

    const sampleExpenses: Expense[] = [
      {
        id: '1',
        amount: 45000,
        description: 'Alquiler',
        category: ExpenseCategory.RENT,
        type: ExpenseType.FIXED,
        date: new Date(),
        isRecurring: true
      },
      {
        id: '2',
        amount: 15000,
        description: 'Supermercado',
        category: ExpenseCategory.FOOD,
        type: ExpenseType.VARIABLE,
        date: new Date(),
        isRecurring: false
      }
    ];

    const sampleSavings: Savings[] = [
      {
        id: '1',
        amount: 20000,
        description: 'Fondo de Emergencia',
        category: SavingsCategory.EMERGENCY_FUND,
        date: new Date(),
        targetAmount: 300000
      },
      {
        id: '2',
        amount: 100,
        description: 'Ahorro en USD',
        category: SavingsCategory.USD_SAVINGS,
        date: new Date(),
        targetAmount: 5000
      }
    ];

    this.incomesSubject.next(sampleIncomes);
    this.expensesSubject.next(sampleExpenses);
    this.savingsSubject.next(sampleSavings);

    this.saveToStorage('incomes', sampleIncomes);
    this.saveToStorage('expenses', sampleExpenses);
    this.saveToStorage('savings', sampleSavings);
  }
}
