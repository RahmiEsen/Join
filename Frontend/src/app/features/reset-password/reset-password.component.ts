import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '../shared/form-helper.service';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
@ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef<HTMLInputElement>>;
  form!: FormGroup;
  submitted = false;
  ignoreNextBlur = false;
  token!: string;
  blurredFields: Record<string, boolean> = {};
  passwordVisibility: Record<string, boolean> = {
    password: false,
    confirmPassword: false
  };
  formFields = [
    { type: 'password', placeholder: 'Password', icon: 'lock.png', alt: 'Password' },
    { type: 'password', placeholder: 'Confirm Password', icon: 'lock.png', alt: 'Confirm Password' }
  ];

  constructor(
    private fb: FormBuilder,
    private formHelper: FormHelperService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || !this.token) {
      console.warn('Form ist ungültig oder Token fehlt.');
      return;
    }
    const newPassword = this.form.value.password;
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Passwort-Reset fehlgeschlagen:', err);
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)]],
      confirmPassword: ['', Validators.required],
    });
  }

  getControlName(label: string): string {
    return {
      'Password': 'password',
      'Confirm Password': 'confirmPassword'
    }[label] || '';
  }

  getErrorMessage(controlName: string): string | null {
    switch (controlName) {
      case 'password': return this.getPasswordError();
      case 'confirmPassword': return this.getConfirmPasswordError();
      default: return null;
    }
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
}