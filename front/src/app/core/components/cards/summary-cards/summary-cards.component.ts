import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardBaseComponent } from '../card-base/card-base.component';
import { CardBaseModel } from '../../../models/card-base.model';
import { SummaryCardModel } from '../../../models/summary-card.model';

@Component({
  selector: 'mb-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CardBaseComponent
  ],
})
export class SummaryCardsComponent implements OnChanges {
  @Input() model!: SummaryCardModel;
  cardModel!: CardBaseModel;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.model) {
      this.cardModel = this.buildCardModel(this.model);
    }
  }

  buildCardModel(model: SummaryCardModel): CardBaseModel {
    const order = model.order || ['income', 'expenses', 'savings', 'balance'];
    const summary = model.summary;
    const showIcons = model.showIcons !== false;

    const cardContents = {
      income: {
        type: showIcons ? 'icon' as const : 'number' as const,
        label: 'Ingresos del Mes',
        value: summary.totalIncome,
        icon: 'trending_up',
        iconClasses: 'text-income-600 text-sm',
        valueClasses: 'text-sm font-bold text-income-600',
        containerClasses: 'financial-card income-card dashboard-card',
        formatType: 'currency' as const,
      },
      expenses: {
        type: showIcons ? 'icon' as const : 'number' as const,
        label: 'Gastos del Mes',
        value: summary.totalExpenses,
        icon: 'trending_down',
        iconClasses: 'text-expense-600 text-sm',
        valueClasses: 'text-sm font-bold text-expense-600',
        containerClasses: 'financial-card expense-card dashboard-card',
        formatType: 'currency' as const,
      },
      savings: {
        type: showIcons ? 'icon' as const : 'number' as const,
        label: 'Ahorros del Mes',
        value: summary.totalSavings,
        icon: 'savings',
        iconClasses: 'text-savings-600 text-sm',
        valueClasses: 'text-sm font-bold text-savings-600',
        containerClasses: 'financial-card savings-card dashboard-card',
        formatType: 'currency' as const,
      },
      balance: {
        type: showIcons ? 'icon' as const : 'number' as const,
        label: 'Balance Neto',
        value: summary.balance,
        icon: summary.balance >= 0 ? 'trending_up' : 'trending_down',
        iconClasses: (summary.balance >= 0 ? 'text-income-600' : 'text-expense-600') + ' text-sm',
        valueClasses: 'text-sm font-bold ' + (summary.balance >= 0 ? 'text-income-600' : 'text-expense-600'),
        containerClasses: 'financial-card dashboard-card',
        formatType: 'currency' as const,
      }
    };

    return {
      config: {
        containerClasses: 'w-full',
        ...model.config,
        title: model.config?.title || 'Resumen Financiero',
      },
      sections: [
        {
          id: 'summary-cards',
          layout: 'grid',
          gridCols: 2,
          sectionClasses: 'lg:grid-cols-4',
          showHeader: false,
          contents: order.map(key => cardContents[key])
        }
      ],
      actions: model.actions,
      refreshAction: model.refreshAction
    };
  }
}
