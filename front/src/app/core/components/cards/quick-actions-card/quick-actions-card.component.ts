import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { QuickActionsCardModelClass } from '../../../classes/cards/quick-actions-card.model.class';
import { CardBaseComponent } from '../card-base/card-base.component';

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
  cardModel = new QuickActionsCardModelClass({
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
  });
}
