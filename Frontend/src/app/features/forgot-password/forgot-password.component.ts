import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '../shared/form-helper.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef<HTMLInputElement>>;
  form!: FormGroup;
  submitted = false;
  passwordVisibility: Record<string, boolean> = {};
  formFields = [
    { type: 'email', placeholder: 'Email', icon: 'mail.png', alt: 'Mail' }
  ];
  emailSent = false;
  emailSentTo: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private formHelper: FormHelperService,
    private http: HttpClient
  ) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      const email = this.form.value.email;
      this.http.post('http://localhost:3000/auth/request-reset', { email }).subscribe({
        next: () => {
          this.emailSent = true;
          this.emailSentTo = email;
        },
        error: () => {
          alert('Fehler beim Senden der E-Mail.');
        }
      });
    }
  }

  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

  getErrorMessage(controlName: string): string | null {
    return this.formHelper.getEmailError(this.form, this.submitted);
  }

  onBlur(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      control.markAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  getControlName(placeholder: string): string {
    return this.formHelper.getControlName(placeholder);
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

  goToLogIn(): void {
    this.router.navigate(['/login']);
  }
}