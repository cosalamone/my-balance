import { CardBaseModel } from './card-base.model';
import { FinancialSummary } from './financial.models';

export interface SummaryCardModel extends CardBaseModel {
  summary: FinancialSummary;
  order?: Array<'income' | 'expenses' | 'savings' | 'balance'>;
  showIcons?: boolean;
  sections?: CardBaseModel['sections'];
  actions?: CardBaseModel['actions'];
}
