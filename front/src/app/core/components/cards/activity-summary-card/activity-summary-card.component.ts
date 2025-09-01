import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardBaseComponent } from '../card-base/card-base.component';
import { ActivitySummaryCardModel } from '../../../models/activity-summary-card.model';
import { FinancialSummary } from '../../../models/financial.models';

@Component({
  selector: 'mb-activity-summary-card',
  standalone: true,
  templateUrl: './activity-summary-card.component.html',
  styleUrls: ['./activity-summary-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CardBaseComponent
  ],
})
export class ActivitySummaryCardComponent implements OnChanges {
  @Input() summary: FinancialSummary | null = null;
  @Output() refreshClicked = new EventEmitter<void>();

  cardModel: ActivitySummaryCardModel = this.buildModel(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary']) {
      this.cardModel = this.buildModel(this.summary);
    }
  }

  buildModel(summary: FinancialSummary | null): ActivitySummaryCardModel {
    return {
      config: {
        title: 'Actividad Reciente',
        showRefreshButton: true,
        containerClasses: 'p-2 dashboard-card flex-1 min-h-0 mx-2 flex flex-col',
        contentClasses: 'overflow-y-auto max-h-[210px] pt-1',
      },
      summary: summary ?? {
        totalIncome: 0,
        totalExpenses: 0,
        totalSavings: 0,
        balance: 0,
        currentMonth: { income: 0, expenses: 0, savings: 0 },
        previousMonth: { income: 0, expenses: 0, savings: 0 },
      },
      sections: [
        {
          id: 'activity-summary',
          layout: 'list',
          contents: [
            {
              type: 'number',
              label: 'Total Ingresos',
              value: summary?.totalIncome ?? 0,
              icon: 'trending_up',
              iconClasses: 'text-income-600 text-xs',
              valueClasses: 'font-semibold text-income-600 text-xs',
              containerClasses: 'flex items-center justify-between p-1.5 bg-gray-50 rounded-md',
              formatType: 'currency',
            },
            {
              type: 'number',
              label: 'Total Gastos',
              value: summary?.totalExpenses ?? 0,
              icon: 'trending_down',
              iconClasses: 'text-expense-600 text-xs',
              valueClasses: 'font-semibold text-expense-600 text-xs',
              containerClasses: 'flex items-center justify-between p-1.5 bg-gray-50 rounded-md',
              formatType: 'currency',
            },
            {
              type: 'number',
              label: 'Total Ahorros',
              value: summary?.totalSavings ?? 0,
              icon: 'savings',
              iconClasses: 'text-savings-600 text-xs',
              valueClasses: 'font-semibold text-savings-600 text-xs',
              containerClasses: 'flex items-center justify-between p-1.5 bg-gray-50 rounded-md',
              formatType: 'currency',
            },
            {
              type: 'number',
              label: 'Balance Final',
              value: summary?.balance ?? 0,
              icon: (summary?.balance ?? 0) >= 0 ? 'trending_up' : 'trending_down',
              iconClasses: (summary?.balance ?? 0) >= 0 ? 'text-income-600 text-xs' : 'text-expense-600 text-xs',
              valueClasses: 'font-bold text-xs ' + ((summary?.balance ?? 0) >= 0 ? 'text-income-600' : 'text-expense-600'),
              containerClasses:
                'flex items-center justify-between p-1.5 bg-gray-50 rounded-md border-l-2 ' +
                ((summary?.balance ?? 0) >= 0 ? 'border-l-income-500' : 'border-l-expense-500'),
              formatType: 'currency',
            },
          ],
        },
      ],
      refreshAction: () => this.refreshClicked.emit(),
    };
  }
}
