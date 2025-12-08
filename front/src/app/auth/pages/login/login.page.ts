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
import { Routes } from 'src/app/core/routes/routes.enum';
import { FormConfigService } from 'src/app/core/services/form-config.service';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import { AuthService } from '../../../core/services/auth.service';

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
  isLoading: boolean = false;
  errorMessage: string = '';
  hidePassword: boolean = true;

  // Button models
  loginButtonModel!: ButtonModelBase;
  passwordToggleModel!: ButtonModelBase;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formConfig: FormConfigService
  ) {}

  public ngOnInit(): void {
    this.initForm();

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([Routes.dashboard]);
    }

    // Initialize button models
    this.loginButtonModel = new ButtonModelBase({
      label: 'Iniciar sesión',
      action: () => this.onSubmit(),
      optionDisabled:
        !this.loginForm?.valid || this.isLoading,
      style: 'filled',
    });

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
      iconName: this.hidePassword
        ? 'visibility_off'
        : 'visibility',
      tooltipMessage: 'Mostrar / ocultar contraseña',
    });

    this.loginForm.statusChanges?.subscribe(status => {
      const disabled = status !== 'VALID' || this.isLoading;
      this.loginButtonModel.optionDisabled = disabled;
    });
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  public async onSubmit(): Promise<void> {
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

  public getFieldError(fieldName: string): string {
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
}
