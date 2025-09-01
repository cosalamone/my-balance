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
import { SummaryCardModel } from '../../core/models/summary-card.model';
import { 
  SummaryCardsComponent,
  QuickActionsCardComponent,
  ActivitySummaryCardComponent
} from '../../core/components/cards';

@Component({
  selector: 'mb-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    SummaryCardsComponent,
    QuickActionsCardComponent,
    ActivitySummaryCardComponent
  ],
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

  get summaryCardModel(): SummaryCardModel {
    return {
      summary: this.currentSummary,
      order: ['income', 'expenses', 'savings', 'balance'],
      showIcons: true,
      config: { title: 'Resumen Financiero' }
    };
  }

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

  refreshData(): void {
    this.loadDashboardData();
  }
}
