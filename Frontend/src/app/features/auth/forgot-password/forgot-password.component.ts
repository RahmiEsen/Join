import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { FormHelperService } from '../services/form-utils.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthFormComponent,
    AuthLayoutComponent,
    AuthCardComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})

export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordVisibility: Record<string, boolean> = { password: false };
  ignoreNextBlur = { value: false };
  blurredFields: Record<string, boolean> = {};
  emailSent = false;
  emailSentTo: string = '';
  errorMessage: string | null = null;
  formFields = [
    { type: 'email', placeholder: 'Email', icon: 'mail.png', alt: 'Mail' }
  ];
  
  constructor(
    public formHelper: FormHelperService,
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.form = this.formHelper.createFormWithValidators(['email']);
  }
  
  public onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.clearFieldErrors();
    
    if (!this.form.valid) {
      return;
    }
    
    this.sendPasswordResetRequest(this.form.value.email);
  }
  
  private sendPasswordResetRequest(email: string): void {
    const apiEndpoint = 'https://join-orpin.vercel.app/auth/request-reset';
    const requestPayload = { email };
    
    this.http.post(apiEndpoint, requestPayload).subscribe({
      next: () => this.handleResetRequestSuccess(email),
      error: () => this.handleResetRequestError()
    });
  }
  
  private handleResetRequestSuccess(email: string): void {
    this.emailSent = true;
    this.emailSentTo = email;
    console.log(`Password reset email successfully sent to: ${email}`);
  }
  
  private handleResetRequestError(): void {
    this.errorMessage = 'We couldn\'t find an account with that email address. Please check and try again.';
    this.markControlAsFailed();
  }
  
  private markControlAsFailed(): void {
    this.formHelper.markControlsAsFailed(this.form, 'email');
  }
  
  private clearFieldErrors(): void {
    this.formHelper.clearFieldErrors(this.form, 'email');
  }
  
  goToLogIn(): void {
    this.router.navigate(['/auth/login']);
  }
}