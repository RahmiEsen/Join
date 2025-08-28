import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { AuthCardComponent } from '../../../shared/components/auth-card/auth-card.component';
import { FormHelperService } from '../services/form-utils.service';
import { SuccessPopupComponent } from '../../../shared/components/success-popup/success-popup.component';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthFormComponent,
    AuthLayoutComponent,
    AuthCardComponent,
    SuccessPopupComponent 
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnInit {
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef>;
  form!: FormGroup;
  submitted = false;
  blurredFields: Record<string, boolean> = {};
  passwordVisibility: Record<string, boolean> = {
    password: false,
    confirmPassword: false
  };
  ignoreNextBlur = { value: false };
  formFields = [
    { type: 'text', placeholder: 'Name', icon: 'person.png', alt: 'Person' },
    { type: 'email', placeholder: 'Email', icon: 'mail.png', alt: 'Mail' },
    { type: 'password', placeholder: 'Password', icon: 'lock.png', alt: 'Password' },
    { type: 'password', placeholder: 'Confirm Password', icon: 'lock.png', alt: 'Confirm Password' }
  ];
  isSignedUp = false;

  constructor(
    public formHelper: FormHelperService,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.form = this.formHelper.createFormWithValidators([
      'name',
      'email',
      'password',
      'confirmPassword',
      'privacyAccepted',
    ]);
  }
  
  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.form.value;
    const data = {
      name: name.trim(),
      email,
      password,
    };
    this.registerUser(data);
  }

  private registerUser(data: { name: string; email: string; password: string }): void {
    this.http.post(`${environment.apiUrl}/auth/signup`, data).subscribe({
      next: (res) => this.handleSuccess(res),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(response: any): void {
    console.log('✅ Erfolgreich registriert', response);
    this.resetForm();
    this.isSignedUp = true;
    setTimeout(() => {
      this.isSignedUp = false;
      this.router.navigate(['/auth/login']);
    }, 2000);
  }

  private handleError(error: any): void {
    console.error('❌ Fehler bei der Registrierung:', error?.error?.message || error.message || error);
  }

  private resetForm(): void {
    this.form.reset();
    this.submitted = false;
    this.blurredFields = {};
    this.passwordVisibility = { password: false, confirmPassword: false };
    this.ignoreNextBlur = { value: false };
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach((control) => control.markAsTouched());
  }

  shouldShowPrivacyError(): boolean {
    const control = this.form.get('privacyAccepted');
    return (this.submitted || this.blurredFields['privacyAccepted']) && control?.invalid === true;
  }
}