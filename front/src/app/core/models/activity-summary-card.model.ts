import { CardBaseModel } from './card-base.model';
import { FinancialSummary } from './financial.models';

export interface ActivitySummaryCardModel extends CardBaseModel {
  summary: FinancialSummary;
  config: CardBaseModel['config'];
}
