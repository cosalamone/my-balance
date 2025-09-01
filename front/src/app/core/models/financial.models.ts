// Enums para categorías
export enum IncomeCategory {
  SALARY = 'salary',
  BONUS = 'bonus',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  GIFT = 'gift',
  OTHER = 'other'
}

export enum ExpenseCategory {
  HOUSING = 'housing',
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  UTILITIES = 'utilities',
  OTHER = 'other'
}

export enum SavingsCategory {
  EMERGENCY_FUND = 'emergency_fund',
  VACATION = 'vacation',
  RETIREMENT = 'retirement',
  INVESTMENT = 'investment',
  GOAL = 'goal',
  OTHER = 'other'
}

// Interfaces principales
export interface Income {
  id: string;
  amount: number;
  category: IncomeCategory;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurrencePattern?: 'monthly' | 'weekly' | 'yearly';
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  isFixed: boolean;
  isRecurring: boolean;
  recurrencePattern?: 'monthly' | 'weekly' | 'yearly';
}

export interface Savings {
  id: string;
  amount: number;
  category: SavingsCategory;
  description: string;
  date: Date;
  goalAmount?: number;
  targetDate?: Date;
}

// Interface para el resumen financiero
export interface FinancialSummary {
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

// Interface para metas de ahorro
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: SavingsCategory;
  description?: string;
}

// Interface para datos del dashboard
export interface DashboardData {
  summary: FinancialSummary;
  recentTransactions: (Income | Expense | Savings)[];
  savingsGoals: SavingsGoal[];
  monthlyTrends: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

// Tipos de utilidad
export type TransactionType = 'income' | 'expense' | 'savings';
export type Transaction = Income | Expense | Savings;