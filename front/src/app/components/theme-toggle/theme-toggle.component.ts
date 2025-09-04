import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'mb-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode$: Observable<boolean>;
  isTransitioning = false;

  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.theme$.pipe(
      map(theme => theme === 'dark')
    );
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
