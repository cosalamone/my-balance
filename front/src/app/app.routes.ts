import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/pages/login.page').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/pages/register.page').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/pages/dashboard.page').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ingresos',
    loadComponent: () => import('./ingresos/pages/ingresos.page').then(m => m.IncomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
