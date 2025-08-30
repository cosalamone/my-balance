import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthService } from './app/core/services/auth.service';
import { FinancialDataService } from './app/core/services/financial-data.service';
import { NotificationService } from './app/core/services/notification.service';
import { BiometricAuthService } from './app/core/services/biometric-auth.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
    AuthService,
    FinancialDataService,
    NotificationService,
    BiometricAuthService
  ]
}).catch(err => console.error(err));
