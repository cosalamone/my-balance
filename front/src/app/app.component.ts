import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ButtonCommonComponent } from './core/components/buttons/common-button/common-button';
import { ButtonModelBase } from './core/models/button-base.model';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    ThemeToggleComponent,
    ButtonCommonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'App Gastos - Control Financiero Personal';
  isAuthenticated = false;
  // Button models
  logoutButtonModel!: ButtonModelBase;
  logoutSidenavModel!: ButtonModelBase;
  toggleDrawerModel!: ButtonModelBase;

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      (isAuth: boolean) => (this.isAuthenticated = isAuth)
    );
    // Initialize logout models
    this.logoutButtonModel = new ButtonModelBase({
      action: () => this.logout(),
      style: 'filled',
      buttonType: ButtonCommonComponent as any,
      iconName: 'logout',
      label: '',
    } as any);

    this.logoutSidenavModel = new ButtonModelBase({
      action: (drawer: any) => {
        this.logout();
        drawer?.close();
      },
      style: 'filled',
      buttonType: ButtonCommonComponent as any,
      iconName: 'logout',
      label: 'Cerrar Sesión',
    } as any);

    // Drawer toggle model (used in toolbar)
    this.toggleDrawerModel = new ButtonModelBase({
      action: (drawer: any) => drawer?.toggle(),
      style: 'icon',
      buttonType: ButtonCommonComponent as any,
      iconName: 'menu',
      tooltipMessage: 'Abrir/Cerrar menú',
    } as any);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
