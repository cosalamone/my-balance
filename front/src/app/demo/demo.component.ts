import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { CardClickableModel } from '../core/classes/cards/card-clickable.model';
import { CardLargeModel } from '../core/classes/cards/card-large.model';
import { CardSimpleModel } from '../core/classes/cards/card-simple.model';
import { CardBaseComponent } from '../core/components/cards/card-base/card-base.component';
import { ButtonComponent } from '../core/components/form/button/button.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ThemeToggleComponent,
    ButtonComponent,
    CardBaseComponent,
  ],
  templateUrl: './demo.component.html',
  styleUrls: [],
})
export class DemoComponent {
  public simpleCard = new CardSimpleModel(
    'Card Simple',
    'Contenido básico con hover effect.'
  );
  public clickableCard = new CardClickableModel(
    'Card Clickeable',
    'Esta card tiene efecto de click.',
    () => {
      console.log('Card clicked');
    }
  );
  public largeCard = new CardLargeModel(
    'Card Grande',
    'Card con más padding para contenido extenso.'
  );
}
