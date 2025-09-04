import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'mb-dashboard-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dashboard-section">
      <h2 class="section-title">{{ title }}</h2>
      <p *ngIf="subtitle" class="section-subtitle">
        {{ subtitle }}
      </p>
      <ng-content></ng-content>
    </section>
  `,
})
export class DashboardSectionComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
}
