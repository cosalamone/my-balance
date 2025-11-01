import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { ButtonCommonComponent } from 'src/app/core/components/buttons/common-button/common-button';
import { MessageComponent } from 'src/app/core/components/message/message.component';
import { ButtonModelBase } from 'src/app/core/models/button-base.model';
import { FormConfigService } from 'src/app/core/services/form-config.service';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { AuthService } from '../../../core/services/auth.service';
import { BiometricAuthService } from '../../../core/services/biometric-auth.service';

@Component({
  selector: 'mb-login',
  standalone: true,
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
    ThemeToggleComponent,
    MessageComponent,
    ButtonCommonComponent,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  biometricSupported = false;
  biometricLoading = false;
  showRegisterBiometric = false;
  hidePassword = true;
  // Button models
  loginButtonModel!: ButtonModelBase;
  biometricButtonModel!: ButtonModelBase;
  registerBiometricModel!: ButtonModelBase;
  clearBiometricModel!: ButtonModelBase;
  passwordToggleModel!: ButtonModelBase;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private biometricService: BiometricAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formConfig: FormConfigService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkBiometricSupport();

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    // Initialize button models
    this.loginButtonModel =
      this.formConfig.getSaveButtonModel(false, false);
    this.loginButtonModel.action = () => this.onSubmit();
    this.loginButtonModel.optionDisabled =
      !this.loginForm?.valid || this.isLoading;

    this.biometricButtonModel =
      this.formConfig.getAddButtonModel();
    this.biometricButtonModel.action = () =>
      this.onBiometricLogin();

    this.registerBiometricModel =
      this.formConfig.getAddButtonModel();
    this.registerBiometricModel.action = () =>
      this.onRegisterBiometric();

    this.clearBiometricModel =
      this.formConfig.getDeleteButtonModel();
    this.clearBiometricModel.action = () =>
      this.onClearBiometricCredentials();

    // Password visibility toggle model
    this.passwordToggleModel = new ButtonModelBase({
      action: () => {
        this.hidePassword = !this.hidePassword;
        this.passwordToggleModel.iconName = this
          .hidePassword
          ? 'visibility_off'
          : 'visibility';
      },
      style: 'icon',
      buttonType: ButtonCommonComponent as any,
      iconName: this.hidePassword
        ? 'visibility_off'
        : 'visibility',
      tooltipMessage: 'Mostrar / ocultar contraseña',
    } as any);

    this.loginForm.statusChanges?.subscribe(status => {
      const disabled = status !== 'VALID' || this.isLoading;
      this.loginButtonModel.optionDisabled = disabled;
    });
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        'test@example.com',
        [Validators.required, Validators.email],
      ],
      password: [
        'Test123456!',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      try {
        this.authService.login(email, password).subscribe({
          next: response => {
            this.snackBar.open(
              `¡Bienvenido, ${response.user.firstName}!`,
              'Cerrar',
              {
                duration: 3000,
              }
            );
            this.router.navigate(['/dashboard']);
            this.isLoading = false;
          },
          error: error => {
            console.error('Error en login:', error);
            this.errorMessage =
              error.error?.message ||
              'Credenciales inválidas. Verifique su email y contraseña.';
            this.isLoading = false;
          },
        });
      } catch (error) {
        this.errorMessage =
          'Error al iniciar sesión. Intente nuevamente.';
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
    this.biometricService.biometricSupport$.subscribe(
      supported => {
        this.biometricSupported = supported;
        if (supported) {
          // Verificar si hay credenciales guardadas
          const credentials =
            this.biometricService.getSavedCredentials();
          this.showRegisterBiometric =
            credentials.length === 0;
        }
      }
    );
  }

  /**
   * Login con huella digital
   */
  onBiometricLogin(): void {
    if (!this.biometricSupported) {
      this.snackBar.open(
        'La autenticación biométrica no está disponible',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }

    this.biometricLoading = true;
    this.errorMessage = '';

    this.biometricService
      .authenticateWithBiometric()
      .subscribe(
        username => {
          if (username) {
            // Simular login exitoso con el usuario autenticado
            this.authService
              .login(username, 'biometric-auth')
              .subscribe({
                next: () => {
                  this.snackBar.open(
                    '¡Login biométrico exitoso!',
                    'Cerrar',
                    {
                      duration: 2000,
                    }
                  );
                  this.router.navigate(['/dashboard']);
                  this.biometricLoading = false;
                },
                error: err => {
                  console.error(
                    'Error en login después de biometría:',
                    err
                  );
                  this.errorMessage =
                    'Error al iniciar sesión';
                  this.biometricLoading = false;
                },
              });
          } else {
            this.errorMessage =
              'Autenticación biométrica fallida';
            this.snackBar.open(
              'Autenticación biométrica fallida',
              'Cerrar',
              {
                duration: 3000,
              }
            );
            this.biometricLoading = false;
          }
        },
        error => {
          this.errorMessage =
            error?.message ||
            'Error en autenticación biométrica';
          this.snackBar.open(this.errorMessage, 'Cerrar', {
            duration: 3000,
          });
          this.biometricLoading = false;
        }
      );
  }

  /**
   * Registrar huella digital
   */
  onRegisterBiometric(): void {
    if (!this.biometricSupported) {
      this.snackBar.open(
        'La autenticación biométrica no está disponible',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }

    if (!this.loginForm.valid) {
      this.snackBar.open(
        'Complete el formulario antes de registrar la huella',
        'Cerrar',
        {
          duration: 3000,
        }
      );
      return;
    }

    const email = this.loginForm.get('email')?.value;
    this.biometricLoading = true;

    this.biometricService
      .registerBiometric(email, email.split('@')[0])
      .subscribe(
        success => {
          if (success) {
            this.showRegisterBiometric = false;
            this.snackBar.open(
              '¡Huella digital registrada exitosamente!',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          } else {
            this.snackBar.open(
              'Error al registrar la huella digital',
              'Cerrar',
              {
                duration: 3000,
              }
            );
          }
          this.biometricLoading = false;
        },
        err => {
          this.snackBar.open(
            err?.message ||
              'Error al registrar huella digital',
            'Cerrar',
            { duration: 3000 }
          );
          this.biometricLoading = false;
        }
      );
  }

  /**
   * Limpiar credenciales biométricas
   */
  onClearBiometricCredentials(): void {
    this.biometricService.clearAllCredentials();
    this.showRegisterBiometric = true;
    this.snackBar.open(
      'Credenciales biométricas eliminadas',
      'Cerrar',
      {
        duration: 2000,
      }
    );
  }
}
