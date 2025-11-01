import {
  CardBaseModel,
  CardSection,
} from '../../models/card-base.model';

export class CardModelBase implements CardBaseModel {
  config: CardBaseModel['config'];
  sections?: CardSection[];
  actions?: CardBaseModel['actions'];
  refreshAction?: () => void;

  constructor(partial: Partial<CardBaseModel> = {}) {
    this.config = {
      title: partial.config?.title || '',
      subtitle: partial.config?.subtitle,
      showRefreshButton:
        partial.config?.showRefreshButton ?? false,
      containerClasses:
        partial.config?.containerClasses || '',
      headerClasses: partial.config?.headerClasses || '',
      contentClasses: partial.config?.contentClasses || '',
      showDivider: partial.config?.showDivider ?? false,
    };

    this.sections = partial.sections;
    this.actions = partial.actions;
    this.refreshAction = partial.refreshAction;
  }
}
