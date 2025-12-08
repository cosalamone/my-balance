import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree> {
    // Fast path: if we already have a synced boolean state, return it immediately
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Otherwise, subscribe once to the observable auth state and decide
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated: boolean) => {
        return isAuthenticated
          ? true
          : this.router.parseUrl('/login');
      })
    );
  }
}
