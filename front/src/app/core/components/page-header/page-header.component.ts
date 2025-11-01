import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'mb-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <div
        class="header__logo-container"
        *ngIf="showLogo()"
      >
        <div class="header__logo">
          <div class="logo-glow"></div>
          <div class="logo-content">
            <ng-content select="[slot=logo]"></ng-content>
          </div>
        </div>
        <h1 class="header__title">{{ title() }}</h1>
        <p class="header__subtitle" *ngIf="subtitle()">
          {{ subtitle() }}
        </p>
      </div>
      <div *ngIf="!showLogo()">
        <h2 class="page-title">{{ title() }}</h2>
        <p class="page-subtitle" *ngIf="subtitle()">
          {{ subtitle() }}
        </p>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  public readonly title = input<string>('');
  public readonly subtitle = input<string | undefined>();
  public readonly showLogo = input<boolean>(false);
}
