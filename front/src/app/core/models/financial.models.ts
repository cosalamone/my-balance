// Enums para categorías
export enum IncomeCategory {
  SALARY = 0,
  BONUS = 1,
  FREELANCE = 2,
  INVESTMENT = 3,
  GIFT = 4,
  AGUINALDO = 5,
  OTHER = 6,
}

export enum ExpenseCategory {
  HOUSING = 0,
  FOOD = 1,
  TRANSPORTATION = 2,
  ENTERTAINMENT = 3,
  HEALTHCARE = 4,
  EDUCATION = 5,
  SHOPPING = 6,
  UTILITIES = 7,
  OTHER = 8,
}

export enum SavingsCategory {
  EMERGENCY_FUND = 'emergency_fund',
  VACATION = 'vacation',
  RETIREMENT = 'retirement',
  INVESTMENT = 'investment',
  GOAL = 'goal',
  USD_SAVINGS = 'usd_savings',
  OTHER = 'other',
}

// Enum para tipos de gasto
export enum ExpenseType {
  FIXED = 0,
  VARIABLE = 1,
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
  type?: ExpenseType;
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
  targetAmount?: number;
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
export type TransactionType =
  | 'income'
  | 'expense'
  | 'savings';
export type Transaction = Income | Expense | Savings;
