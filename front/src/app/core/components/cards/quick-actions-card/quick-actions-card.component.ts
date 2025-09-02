import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardBaseComponent } from '../card-base/card-base.component';
import { QuickActionsCardModel } from '../../../models/quick-actions-card.model';

@Component({
  selector: 'mb-quick-actions-card',
  templateUrl: './quick-actions-card.component.html',
  styleUrls: ['./quick-actions-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CardBaseComponent,
  ],
})
export class QuickActionsCardComponent {
  cardModel: QuickActionsCardModel = {
    config: {
      title: 'Acciones Rápidas',
      containerClasses: 'p-2 dashboard-card flex-shrink-0 mx-2',
      contentClasses: 'pt-1',
      showDivider: false, // Oculta la raya/divider
    },
    actions: [
      {
        label: 'Ingreso',
        icon: 'add_circle',
        routerLink: '/ingresos',
        color: 'primary',
      },
      {
        label: 'Gasto',
        icon: 'remove_circle',
        routerLink: '/gastos',
        color: 'warn',
      },
      {
        label: 'Ahorro',
        icon: 'savings',
        routerLink: '/ahorros',
        color: 'accent',
      },
      {
        label: 'Reportes',
        icon: 'analytics',
        routerLink: '/reportes',
      },
    ],
    order: ['Ingreso', 'Gasto', 'Ahorro', 'Reportes'],
  };
}
