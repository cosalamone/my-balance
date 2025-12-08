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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ButtonCommonComponent } from 'src/app/core/components/buttons/common-button/common-button';
import { MessageComponent } from 'src/app/core/components/message/message.component';
import { PageHeaderComponent } from 'src/app/core/components/page-header/page-header.component';
import { ButtonModelBase } from 'src/app/core/models/button-base.model';
import { Routes } from 'src/app/core/routes/routes.enum';
import { FormConfigService } from 'src/app/core/services/form-config.service';
import { ThemeToggleComponent } from '../../../components/theme-toggle/theme-toggle.component';
import {
  AuthService,
  RegisterRequest,
} from '../../../core/services/auth.service';

@Component({
  selector: 'mb-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ThemeToggleComponent,
    MessageComponent,
    PageHeaderComponent,
    ButtonCommonComponent,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;
  // Button models
  registerButtonModel!: ButtonModelBase;
  loginNavModel!: ButtonModelBase;
  passwordToggleModel!: ButtonModelBase;
  confirmPasswordToggleModel!: ButtonModelBase;

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
    this.registerButtonModel = new ButtonModelBase({
      label: 'Crear cuenta',
      action: () => this.onSubmit(),
      optionDisabled:
        !this.registerForm?.valid || this.isLoading,
    } as any);

    this.loginNavModel =
      this.formConfig.getCancelButtonModel();
    this.loginNavModel.action = () =>
      this.navigateToLogin();

    this.registerForm.statusChanges?.subscribe(status => {
      const disabled = status !== 'VALID' || this.isLoading;
      this.registerButtonModel.optionDisabled = disabled;
    });

    // Password visibility toggle models
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

    this.confirmPasswordToggleModel = new ButtonModelBase({
      action: () => {
        this.hideConfirmPassword =
          !this.hideConfirmPassword;
        this.confirmPasswordToggleModel.iconName = this
          .hideConfirmPassword
          ? 'visibility_off'
          : 'visibility';
      },
      style: 'icon',
      buttonType: ButtonCommonComponent as any,
      iconName: this.hideConfirmPassword
        ? 'visibility_off'
        : 'visibility',
      tooltipMessage: 'Mostrar / ocultar contraseña',
    } as any);
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email],
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(6)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(
    form: FormGroup
  ): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (
        Object.keys(confirmPassword.errors!).length === 0
      ) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  public async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { firstName, lastName, email, password } =
        this.registerForm.value;

      const registerData: RegisterRequest = {
        firstName,
        lastName,
        email,
        password,
      };

      try {
        this.authService.register(registerData).subscribe({
          next: response => {
            this.snackBar.open(
              `¡Bienvenido, ${response.user.firstName}! Tu cuenta ha sido creada exitosamente.`,
              'Cerrar',
              { duration: 4000 }
            );
            this.router.navigate(['/dashboard']);
            this.isLoading = false;
          },
          error: error => {
            console.error('Error en registro:', error);
            this.errorMessage =
              error.error?.message ||
              'Error al crear la cuenta. Intente nuevamente.';
            this.isLoading = false;
          },
        });
      } catch (error) {
        this.errorMessage =
          'Error al crear la cuenta. Intente nuevamente.';
        this.isLoading = false;
      }
    }
  }

  public getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Email inválido';
      }
      if (field.errors['minlength']) {
        const minLength =
          field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${minLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        const maxLength =
          field.errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} no puede tener más de ${maxLength} caracteres`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
    };
    return displayNames[fieldName] || fieldName;
  }

  private navigateToLogin(): void {
    this.router.navigate([Routes.login]);
  }
}
