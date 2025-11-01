import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SummaryCardModelClass } from '../../../classes/cards/summary-card.model.class';
import { CardBaseModel } from '../../../models/card-base.model';
import { SummaryCardModel } from '../../../models/summary-card.model';
import { CardBaseComponent } from '../card-base/card-base.component';

@Component({
  selector: 'mb-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
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
export class SummaryCardsComponent implements OnChanges {
  @Input() model!: SummaryCardModel | null;
  cardModel!: CardBaseModel;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.model) {
      // If an instance of the new class is passed use it directly, otherwise create one
      if (
        (this.model as any) instanceof SummaryCardModelClass
      ) {
        this.cardModel = this
          .model as unknown as CardBaseModel;
      } else {
        this.cardModel = new SummaryCardModelClass(
          this.model as SummaryCardModel
        );
      }
    }
  }
}
