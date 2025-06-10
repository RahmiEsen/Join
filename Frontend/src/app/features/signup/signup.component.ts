import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef>;

  form!: FormGroup;
  submitted = false;
  ignoreNextBlur = false;
  blurredFields: Record<string, boolean> = {};
  passwordVisibility: Record<string, boolean> = {
    password: false,
    confirmPassword: false
  };
  formFields = [
    { type: 'text', placeholder: 'Name', icon: 'person.png', alt: 'Person' },
    { type: 'email', placeholder: 'Email', icon: 'mail.png', alt: 'Mail' },
    { type: 'password', placeholder: 'Password', icon: 'lock.png', alt: 'Password' },
    { type: 'password', placeholder: 'Confirm Password', icon: 'lock.png', alt: 'Confirm Password' }
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.createForm();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }
    const data = {
      name: this.form.value.name.trim(),
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.registerUser(data);
  }
//Backend
  private registerUser(data: any): void {
    this.http.post('http://localhost:3000/auth/signup', data).subscribe({
      next: (res) => this.handleSuccess(res),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(response: any): void {
    console.log('✅ Erfolgreich registriert', response);
    this.resetForm();
    this.router.navigate(['/login']);
  }

  private handleError(error: any): void {
    console.error('Fehler bei der Registrierung', error);
  }


//Start
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)]],
      confirmPassword: ['', Validators.required],
      privacyAccepted: [false, Validators.requiredTrue]
    });
  }

  private resetForm(): void {
    this.form.reset();
    this.submitted = false;
    this.blurredFields = {};
    this.passwordVisibility = { password: false, confirmPassword: false };
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(c => c.markAsTouched());
  }

  getControlName(label: string): string {
    return {
      'Name': 'name',
      'Email': 'email',
      'Password': 'password',
      'Confirm Password': 'confirmPassword'
    }[label] || '';
  }

  getErrorMessage(controlName: string): string | null {
    switch (controlName) {
      case 'name': return this.getNameError();
      case 'email': return this.getEmailError();
      case 'password': return this.getPasswordError();
      case 'confirmPassword': return this.getConfirmPasswordError();
      default: return null;
    }
  }

  private getNameError(): string | null {
    const control = this.form.get('name');
    if (!control || (!control.touched && !this.submitted)) return null;
    return control.hasError('required') ? 'Please enter your name.' : null;
  }

  private getEmailError(): string | null {
    const control = this.form.get('email');
    if (!control || (!control.touched && !this.submitted)) return null;
    if (control.hasError('required')) return 'Please enter your email address.';
    return control.hasError('pattern') ? 'Please enter a valid email address.' : null;
  }

  private getPasswordError(): string | null {
    const control = this.form.get('password');
    if (!control || (!control.touched && !this.submitted)) return null;
    if (control.hasError('required')) return 'Please enter a password.';
    if (control.hasError('minlength')) return 'Password must be at least 6 characters.';
    return control.hasError('pattern')
      ? 'Password must include upper and lower case letters and a number.'
      : null;
  }

  private getConfirmPasswordError(): string | null {
    const control = this.form.get('confirmPassword');
    const password = this.form.get('password')?.value;
    if (!control || (!control.touched && !this.submitted)) return null;
    if (control.hasError('required') || control.value !== password) {
      return `Your passwords don't match. Please try again.`;
    }
    return null;
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
    const input = this.passwordInputs.find((_, i) =>
      this.getControlName(this.formFields[i].placeholder) === controlName
    )?.nativeElement;
    if (input) {
      const len = input.value.length;
      input.setSelectionRange(len, len);
      input.focus();
    }
  }

  getInputType(field: any): string {
    const name = this.getControlName(field.placeholder);
    return (name === 'password' || name === 'confirmPassword') && !this.passwordVisibility[name]
      ? 'password'
      : 'text';
  }

  getFormIconSrc(field: any): string {
    const name = this.getControlName(field.placeholder);
    return (name === 'password' || name === 'confirmPassword')
      ? this.getPasswordIcon(field)
      : field.icon;
  }

  getPasswordIcon(field: any): string {
    const name = this.getControlName(field.placeholder);
    const value = this.form.get(name)?.value;
    if (!value) return 'lock.png';
    return this.passwordVisibility[name] ? 'see.png' : 'unseen.png';
  }

  isToggleablePasswordField(field: any): boolean {
    const name = this.getControlName(field.placeholder);
    const value = this.form.get(name)?.value;
    return (name === 'password' || name === 'confirmPassword') && !!value?.length;
  }

  hasError(controlName: string): boolean {
    return this.blurredFields[controlName] && this.form.get(controlName)?.invalid === true;
  }

  hasConfirmPasswordError(): boolean {
    const confirm = this.form.get('confirmPassword');
    const password = this.form.get('password');
    const touched = this.submitted || this.blurredFields['confirmPassword'];
    const mismatch = password?.value && confirm?.value && password.value !== confirm.value;
    return touched && (!!confirm?.invalid || mismatch);
  }

  shouldShowPrivacyError(): boolean {
    const control = this.form.get('privacyAccepted');
    return (this.submitted || this.blurredFields['privacyAccepted']) && control?.invalid === true;
  }
}
