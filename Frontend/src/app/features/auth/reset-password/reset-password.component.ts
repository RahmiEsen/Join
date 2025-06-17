import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { FormHelperService } from '../../../shared/services/form-utils.service';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthFormComponent,
    AuthLayoutComponent,
    AuthCardComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})

export class ResetPasswordComponent {
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef<HTMLInputElement>>;
  form!: FormGroup;
  submitted = false;
  ignoreNextBlur = { value: false };
  blurredFields: Record<string, boolean> = {};
  passwordVisibility: Record<string, boolean> = {
    password: false,
    confirmPassword: false
  };
  token!: string;
  resetErrorMessage: string | null = null;
  formFields = [
    { type: 'password', placeholder: 'Password', icon: 'lock.png', alt: 'Password' },
    { type: 'password', placeholder: 'Confirm Password', icon: 'lock.png', alt: 'Confirm Password' }
  ];
  
  constructor(
    public formHelper: FormHelperService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  
  ngOnInit(): void {
    this.form = this.formHelper.createFormWithValidators(
      ['password', 'confirmPassword'],
      true 
    );
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || '';
    });
  }
  
  public onSubmit(): void {
    this.setSubmittedState();
    if (this.shouldAbortSubmission()) {
      this.logAbortedSubmission();
      return;
    }
    this.resetPassword();
  }
  
  private setSubmittedState(): void {
    this.submitted = true;
    this.resetErrorMessage = null;
    this.formHelper.clearFieldErrors(this.form, ['password', 'confirmPassword']);
  }
  
  private shouldAbortSubmission(): boolean {
    return this.isFormInvalid() || this.isTokenMissing();
  }
  
  private isFormInvalid(): boolean {
    return this.form.invalid;
  }
  
  private isTokenMissing(): boolean {
    return !this.token;
  }
  
  private logAbortedSubmission(): void {
    const reason = this.isFormInvalid() ? 'invalid form' : 'missing token';
    console.warn(`Password reset aborted: ${reason}`);
  }
  
  private resetPassword(): void {
    const newPassword = this.form.value.password;
    
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => this.handleResetSuccess(),
      error: (err) => this.handleResetError(err)
    });
  }
  
  private handleResetSuccess(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { passwordReset: 'success' }
    });
  }
  
  private handleResetError(error: any): void {
    if (error.status === 409) {
      this.resetErrorMessage = 'You cannot use your previous password. Please choose a different one.';
      this.formHelper.markControlsAsFailed(this.form, ['password', 'confirmPassword'], 'samePassword');
    } else {
      this.resetErrorMessage = error.error?.message || 'Password reset failed. Please try again.';
      console.error('Password reset failed:', error);
    }
  }
}