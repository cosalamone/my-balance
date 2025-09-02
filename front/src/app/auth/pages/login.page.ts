import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { BiometricAuthService } from '../../core/services/biometric-auth.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'mb-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule,
    ThemeToggleComponent
  ],

})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  biometricSupported = false;
  biometricLoading = false;
  showRegisterBiometric = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private biometricService: BiometricAuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkBiometricSupport();
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['test@example.com', [Validators.required, Validators.email]],
      password: ['Test123456!', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      try {
        this.authService.login(email, password).subscribe({
          next: (response) => {
            this.snackBar.open(`¡Bienvenido, ${response.user.firstName}!`, 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/dashboard']);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error en login:', error);
            this.errorMessage = error.error?.message || 'Credenciales inválidas. Verifique su email y contraseña.';
            this.isLoading = false;
          }
        });
      } catch (error) {
        this.errorMessage = 'Error al iniciar sesión. Intente nuevamente.';
        this.isLoading = false;
      }
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        return `${fieldName} debe tener al menos 6 caracteres`;
      }
    }
    return '';
  }

  /**
   * Verifica soporte biométrico
   */
  private checkBiometricSupport(): void {
    this.biometricService.biometricSupport$.subscribe(supported => {
      this.biometricSupported = supported;
      if (supported) {
        // Verificar si hay credenciales guardadas
        const credentials = this.biometricService.getSavedCredentials();
        this.showRegisterBiometric = credentials.length === 0;
      }
    });
  }

  /**
   * Login con huella digital
   */
  async onBiometricLogin(): Promise<void> {
    if (!this.biometricSupported) {
      this.snackBar.open('La autenticación biométrica no está disponible', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.biometricLoading = true;
    this.errorMessage = '';

    try {
      const username = await this.biometricService.authenticateWithBiometric();
      
      if (username) {
        // Simular login exitoso con el usuario autenticado
        await this.authService.login(username, 'biometric-auth');
        this.snackBar.open('¡Login biométrico exitoso!', 'Cerrar', {
          duration: 2000
        });
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Autenticación biométrica fallida';
        this.snackBar.open('Autenticación biométrica fallida', 'Cerrar', {
          duration: 3000
        });
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Error en autenticación biométrica';
      this.snackBar.open(this.errorMessage, 'Cerrar', {
        duration: 3000
      });
    } finally {
      this.biometricLoading = false;
    }
  }

  /**
   * Registrar huella digital
   */
  async onRegisterBiometric(): Promise<void> {
    if (!this.biometricSupported) {
      this.snackBar.open('La autenticación biométrica no está disponible', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (!this.loginForm.valid) {
      this.snackBar.open('Complete el formulario antes de registrar la huella', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const email = this.loginForm.get('email')?.value;
    this.biometricLoading = true;

    try {
      const success = await this.biometricService.registerBiometric(
        email,
        email.split('@')[0] // Usar la parte antes del @ como display name
      );

      if (success) {
        this.showRegisterBiometric = false;
        this.snackBar.open('¡Huella digital registrada exitosamente!', 'Cerrar', {
          duration: 3000
        });
      } else {
        this.snackBar.open('Error al registrar la huella digital', 'Cerrar', {
          duration: 3000
        });
      }
    } catch (error: any) {
      this.snackBar.open(error.message || 'Error al registrar huella digital', 'Cerrar', {
        duration: 3000
      });
    } finally {
      this.biometricLoading = false;
    }
  }

  /**
   * Limpiar credenciales biométricas
   */
  onClearBiometricCredentials(): void {
    this.biometricService.clearAllCredentials();
    this.showRegisterBiometric = true;
    this.snackBar.open('Credenciales biométricas eliminadas', 'Cerrar', {
      duration: 2000
    });
  }
}