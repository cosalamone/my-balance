import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  effect,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivitySummaryCardModelClass } from '../../../classes/cards/activity-summary-card.model.class';
import { FinancialSummary } from '../../../models/financial.models';
import { CardBaseComponent } from '../card-base/card-base.component';

@Component({
  selector: 'mb-activity-summary-card',
  standalone: true,
  templateUrl: './activity-summary-card.component.html',
  styleUrls: ['./activity-summary-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CardBaseComponent,
  ],
})
export class ActivitySummaryCardComponent {
  public readonly summary = input<FinancialSummary | null>(
    null
  );
  @Output() refreshClicked = new EventEmitter<void>();
  public readonly onRefreshCallback = input<
    (() => void) | undefined
  >();

  cardModel = new ActivitySummaryCardModelClass(
    null as any
  );

  constructor() {
    effect(() => {
      const s = this.summary();
      this.cardModel = new ActivitySummaryCardModelClass(
        s ?? undefined
      );
    });
  }
}
