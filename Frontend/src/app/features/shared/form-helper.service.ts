import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormHelperService {
  getEmailError(form: FormGroup, submitted: boolean): string | null {
    const control = form.get('email');
    if (!control || (!control.touched && !submitted)) return null;
    if (control.hasError('required')) return 'Please enter your email address.';
    return control.hasError('pattern') ? 'Please enter a valid email address.' : null;
  }

  getPasswordError(form: FormGroup, submitted: boolean): string | null {
    const control = form.get('password');
    if (!control || (!control.touched && !submitted)) return null;
    if (control.hasError('required')) return 'Please enter a password.';
    if (control.hasError('minlength')) return 'Password must be at least 6 characters.';
    return control.hasError('pattern')
      ? 'Password must include upper and lower case letters and a number.'
      : null;
  }

  getControlName(placeholder: string): string {
    return placeholder.trim().toLowerCase().replace(' ', '');
  }

  getInputType(field: any, passwordVisibility: Record<string, boolean>): string {
    const name = this.getControlName(field.placeholder);
    return (name === 'password' || name === 'confirmPassword') && !passwordVisibility[name]
      ? 'password'
      : 'text';
  }

  getPasswordIcon(field: any, form: FormGroup, passwordVisibility: Record<string, boolean>): string {
    const name = this.getControlName(field.placeholder);
    const value = form.get(name)?.value;
    if (!value) return 'lock.png';
    return passwordVisibility[name] ? 'see.png' : 'unseen.png';
  }

  getFormIconSrc(field: any, form: FormGroup, passwordVisibility: Record<string, boolean>): string {
    const name = this.getControlName(field.placeholder);
    return (name === 'password' || name === 'confirmPassword')
      ? this.getPasswordIcon(field, form, passwordVisibility)
      : field.icon;
  }

  isToggleablePasswordField(field: any, form: FormGroup): boolean {
    const name = this.getControlName(field.placeholder);
    const value = form.get(name)?.value;
    return (name === 'password' || name === 'confirmPassword') && !!value?.length;
  }
}
