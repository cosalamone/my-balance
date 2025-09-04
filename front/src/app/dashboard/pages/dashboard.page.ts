import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import {
  ActivitySummaryCardComponent,
  QuickActionsCardComponent,
  SummaryCardsComponent,
} from 'src/app/core/components/cards';
import { DashboardSectionComponent } from 'src/app/core/components/dashboard-section/dashboard-section.component';
import { MessageComponent } from 'src/app/core/components/message/message.component';
import { PageHeaderComponent } from 'src/app/core/components/page-header/page-header.component';
import { FinancialSummary } from '../../core/models/financial.models';
import { SummaryCardModel } from '../../core/models/summary-card.model';
import { AuthService } from '../../core/services/auth.service';
import { FinancialDataService } from '../../core/services/financial-data.service';

// Importar componentes compartido
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
    MatSnackBarModule,
    SummaryCardsComponent,
    QuickActionsCardComponent,
    ActivitySummaryCardComponent,
    PageHeaderComponent,
    DashboardSectionComponent,
    MessageComponent,
  ],
})
export class DashboardComponent
  implements OnInit, OnDestroy
{
  private destroy$ = new Subject<void>();

  currentSummary: FinancialSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    balance: 0,
    currentMonth: {
      income: 0,
      expenses: 0,
      savings: 0,
    },
    previousMonth: {
      income: 0,
      expenses: 0,
      savings: 0,
    },
  };
  isLoading = true;
  currentUser: any = null;
  lastUpdated = new Date();

  // Daily tips array
  private dailyTips = [
    '💡 Consejo: Revisa tus gastos semanalmente para mantener el control de tu presupuesto.',
    '💰 Tip: Ahorra al menos el 20% de tus ingresos mensuales.',
    '📊 Sugerencia: Categoriza tus gastos para identificar áreas de mejora.',
    '🎯 Meta: Establece objetivos financieros específicos y alcanzables.',
    '📈 Estrategia: Invierte en tu educación financiera para mejores decisiones.',
    '💳 Consejo: Evita las compras impulsivas, espera 24 horas antes de decidir.',
    '🏦 Tip: Mantén un fondo de emergencia equivalente a 3-6 meses de gastos.',
  ];

  get summaryCardModel(): SummaryCardModel {
    return {
      summary: this.currentSummary,
      order: ['income', 'expenses', 'savings', 'balance'],
      showIcons: true,
      config: { title: 'Resumen Financiero' },
    };
  }

  constructor(
    private financialService: FinancialDataService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get current user info
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Load dashboard summary from API
    this.financialService
      .getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: summary => {
          this.currentSummary = {
            totalIncome: summary.totalIncome,
            totalExpenses: summary.totalExpenses,
            totalSavings: summary.totalSavings,
            balance: summary.balance,
            currentMonth: summary.currentMonth,
            previousMonth: summary.previousMonth,
          };
          this.isLoading = false;
        },
        error: error => {
          console.error(
            'Error loading dashboard data:',
            error
          );
          this.snackBar.open(
            'Error al cargar los datos del dashboard',
            'Cerrar',
            {
              duration: 3000,
            }
          );
          this.isLoading = false;
        },
      });

    // Also load user data for detailed views
    this.financialService.loadUserData();
  }

  refreshData(): void {
    this.loadDashboardData();
    this.lastUpdated = new Date();
  }

  getDailyTip(): string {
    const today = new Date().getDate();
    const tipIndex = today % this.dailyTips.length;
    return this.dailyTips[tipIndex];
  }
}
