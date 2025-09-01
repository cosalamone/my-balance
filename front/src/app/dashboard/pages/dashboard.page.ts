import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { FinancialDataService } from '../../core/services/financial-data.service';
import { FinancialSummary } from '../../core/models/financial.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardComponent implements OnInit {
  currentSummary: FinancialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    balance: 0,
    currentMonth: {
      income: 0,
      expenses: 0,
      savings: 0
    },
    previousMonth: {
      income: 0,
      expenses: 0,
      savings: 0
    }
  };
  isLoading = true;

  constructor(
    private financialService: FinancialDataService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Load sample data if none exists
    const hasData = localStorage.getItem('incomes') || 
                   localStorage.getItem('expenses') || 
                   localStorage.getItem('savings');
    
    if (!hasData) {
      this.financialService.loadSampleData();
    }

    this.currentSummary = this.financialService.getCurrentMonthSummary();
    this.isLoading = false;
  }

  get balanceColor(): string {
    return this.currentSummary.balance >= 0 ? 'text-income-600' : 'text-expense-600';
  }

  get balanceIcon(): string {
    return this.currentSummary.balance >= 0 ? 'trending_up' : 'trending_down';
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
