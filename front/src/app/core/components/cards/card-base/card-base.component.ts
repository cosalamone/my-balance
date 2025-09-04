import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CardBaseModel,
  CardAction,
  CardSection,
  CardContent,
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
  @Input() cardModel!: CardBaseModel;
  @Output() refreshClicked = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<CardAction>();

  onRefresh(): void {
    if (this.cardModel.refreshAction) {
      this.cardModel.refreshAction();
    }
    this.refreshClicked.emit();
  }

  onActionClick(action: CardAction): void {
    if (action.action) {
      action.action();
    }
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
    const actionsCount = this.cardModel.actions?.length || 0;
    if (actionsCount <= 2) return 'grid-cols-2';
    if (actionsCount <= 4) return 'grid-cols-2 lg:grid-cols-4';
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
