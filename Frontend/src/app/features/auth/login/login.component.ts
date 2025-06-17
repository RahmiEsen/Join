import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormHelperService } from '../../shared/form-helper.service';
import { AuthService } from '../../shared/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../../shared/auth-form/auth-form.component';
import { AuthCardComponent } from '../../shared/auth-card/auth-card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthFormComponent,
    AuthLayoutComponent,
    AuthCardComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent implements OnInit {
  @ViewChildren(AuthFormComponent) formFieldComponents!: QueryList<AuthFormComponent>;
  form!: FormGroup;
  submitted = false;
  ignoreNextBlur = { value: false };
  blurredFields: Record<string, boolean> = {};
  passwordVisibility: Record<string, boolean> = { password: false };
  loginErrorMessage: string | null = null;
  loginFailed = false;
  formFields = [
    { type: 'email', placeholder: 'Email', icon: 'mail.png', alt: 'Mail', controlName: 'email' },
    { type: 'password', placeholder: 'Password', icon: 'lock.png', alt: 'Password', controlName: 'password' }
  ];
  
  constructor(
    public formHelper: FormHelperService,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.form = this.formHelper.createFormWithValidators([
      'email',
      'password'
    ]);
    this.form.addControl('remember', new FormControl(false));
    this.loadRememberedEmail();
  }
  
  private loadRememberedEmail(): void {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.form.patchValue({ email: rememberedEmail, remember: true });
    }
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
  
  private getFormCredentials(): { email: string; password: string; remember: boolean } {
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
    this.markControlAsFailed();
  }
  
  private markControlAsFailed(): void {
    this.formHelper.markControlsAsFailed(this.form, 'email');
  }
  
  private clearFieldErrors(): void {
    this.formHelper.clearFieldErrors(this.form, 'email');
  }
  
  loginWithGoogle(): void {
    window.location.href = 'http://localhost:3000/auth/google';
  }
  
  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}