import { CardModelBase } from './card-base.class';

export class CardSimpleModel extends CardModelBase {
  constructor(title: string, subtitle?: string) {
    super({
      config: {
        title,
        subtitle,
        containerClasses: 'mb-card mb-card--sm',
        showDivider: false,
      },
    });
  }
}
