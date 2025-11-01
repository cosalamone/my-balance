import { CardModelBase } from './card-base.class';

export class CardLargeModel extends CardModelBase {
  constructor(title: string, subtitle?: string) {
    super({
      config: {
        title,
        subtitle,
        containerClasses: 'mb-card mb-card--lg',
      },
    });
  }
}
