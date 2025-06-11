import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormHelperService } from '../shared/form-helper.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef<HTMLInputElement>>;
  form!: FormGroup;
  submitted = false;
  ignoreNextBlur = false;
  blurredFields: Record<string, boolean> = {};
  loginErrorMessage: string | null = null;
  passwordVisibility: Record<string, boolean> = { password: false };
  loginFailed = false;
  formFields = [
    { type: 'email', placeholder: 'Email', icon: 'mail.png', alt: 'Mail' },
    { type: 'password', placeholder: 'Password', icon: 'lock.png', alt: 'Password' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formHelper: FormHelperService,
    private authService: AuthService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.loadRememberedEmail();
  }

  private loadRememberedEmail(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.form.patchValue({ email: rememberedEmail, remember: true });
    }
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginFailed = false;
    this.loginErrorMessage = null;
    this.clearFieldErrors();
    if (this.form.valid) this.attemptLogin();
  }

  private attemptLogin(): void {
    const { email, password, remember } = this.getFormCredentials();
    this.handleRememberEmail(email, remember);
    this.authService.login(email, password).subscribe({
      next: this.handleLoginSuccess.bind(this),
      error: this.handleLoginError.bind(this)
    });
  }

  private handleRememberEmail(email: string, remember: boolean): void {
    remember ? localStorage.setItem('rememberedEmail', email) 
             : localStorage.removeItem('rememberedEmail');
  }

  private getFormCredentials() {
    return this.form.value;
  }

  private handleLoginSuccess(response: { access_token: string }): void {
    this.authService.saveToken(response.access_token);
    console.log('Login successful');
  }

  private handleLoginError(): void {
    this.loginFailed = true;
    this.submitted = true;
    this.loginErrorMessage = 'Check your email and password. Please try again.';
    this.markControlsAsFailed();
  }

  private markControlsAsFailed(): void {
    ['email', 'password'].forEach(controlName => {
      const control = this.form.get(controlName);
      control?.setErrors({ loginFailed: true });
      control?.markAsTouched();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      remember: [false]
    });
  }

  getErrorMessage(controlName: string): string | null {
    return controlName === 'email' ? this.getEmailError() 
         : controlName === 'password' ? this.getPasswordError() 
         : null;
  }

  onBlur(controlName: string): void {
    if (this.ignoreNextBlur) {
      this.ignoreNextBlur = false;
      return;
    }
    this.blurredFields[controlName] = true;
  }

  togglePasswordVisibility(controlName: string): void {
    this.passwordVisibility[controlName] = !this.passwordVisibility[controlName];
    setTimeout(() => this.focusInputEnd(controlName), 0);
  }

  private focusInputEnd(controlName: string): void {
    const input = this.findInputElement(controlName);
    if (input) this.setCursorToEnd(input);
  }

  private findInputElement(controlName: string): HTMLInputElement | null {
    const elementRef = this.passwordInputs.find((_, i) =>
      this.getControlName(this.formFields[i].placeholder) === controlName
    );
    return elementRef?.nativeElement || null;
  }

  private setCursorToEnd(input: HTMLInputElement): void {
    const len = input.value.length;
    input.setSelectionRange(len, len);
    input.focus();
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  private clearFieldErrors(): void {
    ['email', 'password'].forEach(name => {
      const control = this.form.get(name);
      if (control?.hasError('loginFailed')) {
        const errors = { ...control.errors };
        delete errors['loginFailed'];
        control.setErrors(Object.keys(errors).length ? errors : null);
      }
    });
  }

  getEmailError(): string | null {
    return this.formHelper.getEmailError(this.form, this.submitted);
  }

  getPasswordError(): string | null {
    return this.loginErrorMessage || 
           this.formHelper.getPasswordError(this.form, this.submitted);
  }

  getControlName(label: string): string {
    return this.formHelper.getControlName(label);
  }

  getInputType(field: any): string {
    return this.formHelper.getInputType(field, this.passwordVisibility);
  }

  getFormIconSrc(field: any): string {
    return this.formHelper.getFormIconSrc(field, this.form, this.passwordVisibility);
  }

  isToggleablePasswordField(field: any): boolean {
    return this.formHelper.isToggleablePasswordField(field, this.form);
  }

  isPasswordField(placeholder: string): boolean {
    return placeholder.toLowerCase() === 'password';
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}