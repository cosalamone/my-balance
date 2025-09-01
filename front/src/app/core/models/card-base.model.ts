export interface CardBaseConfig {
  title: string;
  subtitle?: string;
  showRefreshButton?: boolean;
  containerClasses?: string;
  headerClasses?: string;
  contentClasses?: string;
  showDivider?: boolean;
}

export interface CardAction {
  label: string;
  icon: string;
  routerLink?: string;
  action?: () => void;
  color?: 'primary' | 'accent' | 'warn' | '';
  classes?: string;
}

export interface CardContent {
  type: 'text' | 'number' | 'icon' | 'actions' | 'custom';
  value?: any;
  label?: string;
  icon?: string;
  iconClasses?: string;
  valueClasses?: string;
  labelClasses?: string;
  containerClasses?: string;
  formatType?: 'currency' | 'number' | 'percentage' | 'text';
}

export interface CardSection {
  id: string;
  title?: string;
  subtitle?: string;
  contents: CardContent[];
  layout: 'grid' | 'list' | 'flex';
  gridCols?: number;
  sectionClasses?: string;
  showHeader?: boolean;
}

export interface CardBaseModel {
  config: CardBaseConfig;
  sections?: CardSection[];
  actions?: CardAction[];
  refreshAction?: () => void;
}
