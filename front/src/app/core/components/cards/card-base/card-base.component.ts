import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {
  CardAction,
  CardBaseModel,
  CardSection,
} from '../../../models/card-base.model';

@Component({
  selector: 'mb-card-base',
  standalone: true,
  templateUrl: './card-base.component.html',
  styleUrls: ['./card-base.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CardBaseComponent {
  public readonly cardModel = input<CardBaseModel>();
  // Backwards-compatible EventEmitters
  @Output() refreshClicked = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<CardAction>();

  // Signal-based callbacks (preferred)
  public readonly onRefreshCallback = input<(() => void) | undefined>();
  public readonly onActionCallback = input<((action: CardAction) => void) | undefined>();

  onRefresh(): void {
    const cm = this.cardModel();
    if (cm?.refreshAction) {
      cm.refreshAction();
    }
    // Prefer callback if provided
    const rcb = this.onRefreshCallback();
    if (rcb) rcb();
    this.refreshClicked.emit();
  }

  onActionClick(action: CardAction): void {
    if (action.action) {
      action.action();
    }
    // Prefer callback if provided
    const acb = this.onActionCallback();
    if (acb) acb(action);
    this.actionClicked.emit(action);
  }

  getSectionLayoutClasses(section: CardSection): string {
    const baseClass =
      section.layout === 'grid'
        ? `grid grid-cols-${section.gridCols || 2} gap-1`
        : section.layout === 'flex'
          ? 'flex flex-wrap gap-1'
          : 'space-y-1';

    return baseClass;
  }

  getActionsGridClasses(): string {
    const actionsCount =
      this.cardModel()?.actions?.length || 0;
    if (actionsCount <= 2) return 'grid-cols-2';
    if (actionsCount <= 4)
      return 'grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-2 lg:grid-cols-3';
  }

  formatValue(value: any, formatType?: string): string {
    if (value === null || value === undefined) return '';

    switch (formatType) {
      case 'currency':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
          .format(value)
          .replace('€', '$');

      case 'number':
        return new Intl.NumberFormat('es-ES', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);

      case 'percentage':
        return `${value}%`;

      default:
        return value.toString();
    }
  }
}
