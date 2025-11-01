import { QuickActionsCardModel } from '../../models/quick-actions-card.model';
import { CardModelBase } from './card-base.class';

export class QuickActionsCardModelClass extends CardModelBase {
  constructor(model?: Partial<QuickActionsCardModel>) {
    super({
      config: {
        title: model?.config?.title || 'Acciones Rápidas',
        containerClasses:
          model?.config?.containerClasses ||
          'p-2 dashboard-card flex-shrink-0 mx-2',
        contentClasses:
          model?.config?.contentClasses || 'pt-1',
        showDivider: model?.config?.showDivider ?? false,
      },
      actions: model?.actions || [],
    });
  }
}
