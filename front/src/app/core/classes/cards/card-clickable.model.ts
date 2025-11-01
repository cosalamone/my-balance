import { CardModelBase } from './card-base.class';

export class CardClickableModel extends CardModelBase {
  constructor(
    title: string,
    subtitle?: string,
    onClick?: () => void
  ) {
    super({
      config: {
        title,
        subtitle,
        containerClasses:
          'mb-card mb-card--md mb-card--clickable',
      },
      refreshAction: onClick,
    });
  }
}
