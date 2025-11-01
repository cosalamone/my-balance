import { SummaryCardModel } from '../../models/summary-card.model';
import { CardModelBase } from './card-base.class';

export class SummaryCardModelClass extends CardModelBase {
  constructor(model: SummaryCardModel) {
    super({
      config: {
        containerClasses: 'w-full',
        ...model.config,
        title: model.config?.title || 'Resumen Financiero',
      },
      sections: [],
      actions: model.actions,
      refreshAction: model.refreshAction,
    });

    const order = model.order || [
      'income',
      'expenses',
      'savings',
      'balance',
    ];
    const summary = model.summary;
    const showIcons = model.showIcons !== false;

    const cardContents: Record<string, any> = {
      income: {
        type: showIcons ? 'icon' : 'number',
        label: 'Ingresos del Mes',
        value: summary.totalIncome,
        icon: 'trending_up',
        iconClasses: 'text-income-600 text-sm',
        valueClasses: 'text-sm font-bold text-income-600',
        containerClasses:
          'financial-card income-card dashboard-card',
        formatType: 'currency',
      },
      expenses: {
        type: showIcons ? 'icon' : 'number',
        label: 'Gastos del Mes',
        value: summary.totalExpenses,
        icon: 'trending_down',
        iconClasses: 'text-expense-600 text-sm',
        valueClasses: 'text-sm font-bold text-expense-600',
        containerClasses:
          'financial-card expense-card dashboard-card',
        formatType: 'currency',
      },
      savings: {
        type: showIcons ? 'icon' : 'number',
        label: 'Ahorros del Mes',
        value: summary.totalSavings,
        icon: 'savings',
        iconClasses: 'text-savings-600 text-sm',
        valueClasses: 'text-sm font-bold text-savings-600',
        containerClasses:
          'financial-card savings-card dashboard-card',
        formatType: 'currency',
      },
      balance: {
        type: showIcons ? 'icon' : 'number',
        label: 'Balance Neto',
        value: summary.balance,
        icon:
          summary.balance >= 0
            ? 'trending_up'
            : 'trending_down',
        iconClasses:
          (summary.balance >= 0
            ? 'text-income-600'
            : 'text-expense-600') + ' text-sm',
        valueClasses:
          'text-sm font-bold ' +
          (summary.balance >= 0
            ? 'text-income-600'
            : 'text-expense-600'),
        containerClasses: 'financial-card dashboard-card',
        formatType: 'currency',
      },
    };

    this.sections = [
      {
        id: 'summary-cards',
        layout: 'grid',
        gridCols: 2,
        sectionClasses: 'lg:grid-cols-4',
        showHeader: false,
        contents: order.map(key => cardContents[key]),
      },
    ];
  }
}
