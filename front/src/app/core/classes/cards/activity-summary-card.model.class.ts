import { FinancialSummary } from '../../models/financial.models';
import { CardModelBase } from './card-base.class';

export class ActivitySummaryCardModelClass extends CardModelBase {
  constructor(summary?: FinancialSummary) {
    const s: FinancialSummary = summary ?? {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
      balance: 0,
      currentMonth: { income: 0, expenses: 0, savings: 0 },
      previousMonth: { income: 0, expenses: 0, savings: 0 },
    };

    super({
      config: {
        title: 'Actividad Reciente',
        showRefreshButton: true,
        containerClasses:
          'p-2 dashboard-card flex-1 min-h-0 mx-2 flex flex-col',
        contentClasses:
          'overflow-y-auto max-h-[210px] pt-1',
      },
      sections: [
        {
          id: 'activity-summary',
          layout: 'list',
          contents: [
            {
              type: 'number',
              label: 'Total Ingresos',
              value: s.totalIncome,
              icon: 'trending_up',
              iconClasses: 'text-income-600 text-xs',
              valueClasses:
                'font-semibold text-income-600 text-xs',
              containerClasses:
                'flex items-center justify-between p-1.5 bg-gray-50 rounded-md',
              formatType: 'currency',
            },
            {
              type: 'number',
              label: 'Total Gastos',
              value: s.totalExpenses,
              icon: 'trending_down',
              iconClasses: 'text-expense-600 text-xs',
              valueClasses:
                'font-semibold text-expense-600 text-xs',
              containerClasses:
                'flex items-center justify-between p-1.5 bg-gray-50 rounded-md',
              formatType: 'currency',
            },
            {
              type: 'number',
              label: 'Total Ahorros',
              value: s.totalSavings,
              icon: 'savings',
              iconClasses: 'text-savings-600 text-xs',
              valueClasses:
                'font-semibold text-savings-600 text-xs',
              containerClasses:
                'flex items-center justify-between p-1.5 bg-gray-50 rounded-md',
              formatType: 'currency',
            },
            {
              type: 'number',
              label: 'Balance Final',
              value: s.balance,
              icon:
                s.balance >= 0
                  ? 'trending_up'
                  : 'trending_down',
              iconClasses:
                s.balance >= 0
                  ? 'text-income-600 text-xs'
                  : 'text-expense-600 text-xs',
              valueClasses:
                'font-bold text-xs ' +
                (s.balance >= 0
                  ? 'text-income-600'
                  : 'text-expense-600'),
              containerClasses:
                'flex items-center justify-between p-1.5 bg-gray-50 rounded-md border-l-2 ' +
                (s.balance >= 0
                  ? 'border-l-income-500'
                  : 'border-l-expense-500'),
              formatType: 'currency',
            },
          ],
        },
      ],
    });
  }
}
