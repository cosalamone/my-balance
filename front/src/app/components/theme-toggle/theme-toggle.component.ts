import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ButtonCommonComponent } from '../../core/components/buttons/common-button/common-button';
import { ButtonModelBase } from '../../core/models/button-base.model';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'mb-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonCommonComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  isTransitioning = false;
  toggleModel!: ButtonModelBase;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.theme$.pipe(
      map(theme => theme === 'dark')
    );

    // Initialize toggle model and keep icon/tooltip in sync with theme
    this.toggleModel = new ButtonModelBase({
      action: () => this.toggleTheme(),
      style: 'icon',
      buttonType: ButtonCommonComponent as any,
      iconName: 'light_mode',
      tooltipMessage: 'Cambiar tema',
    } as any);

    this.isDarkMode$.subscribe(isDark => {
      this.toggleModel.iconName = isDark
        ? 'light_mode'
        : 'dark_mode';
      this.toggleModel.tooltipMessage = isDark
        ? 'Cambiar a modo claro'
        : 'Cambiar a modo oscuro';
    });
  }

  ngOnInit(): void {}

  toggleTheme(): void {
    this.isTransitioning = true;
    this.themeService.toggleTheme();

    // Reset animation state after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }
}
