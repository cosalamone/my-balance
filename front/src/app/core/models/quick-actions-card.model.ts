import { CardBaseModel, CardAction } from './card-base.model';

export interface QuickActionsCardModel extends CardBaseModel {
  actions: CardAction[];
  order?: string[];
  config: CardBaseModel['config'];
}
