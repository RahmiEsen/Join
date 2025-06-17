import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, FormControl, Validators  } from '@angular/forms';
@Injectable({ providedIn: 'root' })

export class FormHelperService {
  createFormWithValidators(fields: string[], addPasswordMatchValidator = false): FormGroup {
    const controls: { [key: string]: FormControl } = {};
    fields.forEach((field) => {
      const config = this.getFieldValidators(field);
      if (config) controls[field] = new FormControl(...config);
    });
    const formGroup = new FormGroup(controls);
    if (addPasswordMatchValidator) {
      formGroup.setValidators(this.passwordMatchValidator);
    }
    return formGroup;
  }
  
  getFieldValidators(field: string): [any, any[]] | null {
    switch (field) {
      case 'name':
        return ['', [Validators.required]];
      case 'email':
        return ['', [
          Validators.required,
          Validators.pattern(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
      ]];
      case 'password':
        return ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]];
      case 'confirmPassword':
        return ['', [Validators.required]];
      case 'privacyAccepted':
        return [false, [Validators.requiredTrue]];
      default:
        return null;
    }
  }
  
  getControlName(placeholder: string): string {
    if (!placeholder || typeof placeholder !== 'string') {
        console.error('Invalid placeholder:', placeholder);
        return '__invalid__';
    }
    const words = placeholder.trim().split(' ');
    return (
      words[0].toLowerCase() +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('')
    );
  }
  
  getInputType(
    field: any, 
    passwordVisibility: Record<string, boolean>
    ): string {
    const name = this.getControlName(field.placeholder);
    return (name === 'password' || name === 'confirmPassword') && !passwordVisibility[name]
      ? 'password'
      : 'text';
  }
  
  togglePasswordVisibility(
    controlName: string,
    passwordVisibility: Record<string, boolean>,
    input: HTMLInputElement
  ) {
    passwordVisibility[controlName] = !passwordVisibility[controlName];
    setTimeout(() => {
      const length = input.value.length;
      input.setSelectionRange(length, length);
      input.focus();
    });
  }
  
  getPasswordIcon(
    field: any,
    form: FormGroup,
    passwordVisibility: Record<string, boolean>
  ): string {
    const name = this.getControlName(field.placeholder);
    const control = form.get(name);
    if (!control) return 'lock.png';
    const value = control.value;
    if (!value) return 'lock.png';
    return passwordVisibility[name] ? 'see.png' : 'unseen.png';
  }
  
  getFormIconSrc(
    field: any,
    form: FormGroup,
    passwordVisibility: Record<string, boolean>
  ): string {
    const name = this.getControlName(field.placeholder);
    return (name === 'password' || name === 'confirmPassword')
      ? this.getPasswordIcon(field, form, passwordVisibility)
      : field.icon;
  }
  
  isToggleablePasswordField(field: any, form: FormGroup): boolean {
    const name = this.getControlName(field.placeholder);
    const control = form.get(name);
    if (!control) return false;
    return (name === 'password' || name === 'confirmPassword') && !!control.value?.length;
  }
  
  onBlur(
    controlName: string,
    ignoreNextBlur: { value: boolean },
    blurredFields: Record<string, boolean>
  ): void {
    if (!controlName || controlName === '__invalid__') return;
    if (ignoreNextBlur.value) {
      ignoreNextBlur.value = false;
      return;
    }
    blurredFields[controlName] = true;
  }
  
  hasError(
    controlName: string,
    form: FormGroup,
    blurredFields: Record<string, boolean>,
    submitted: boolean
  ): boolean {
    const touched = blurredFields[controlName] || submitted;
    return touched && form.get(controlName)?.invalid === true;
  }
  
  hasConfirmPasswordError(
    form: FormGroup,
    submitted: boolean,
    blurredFields: Record<string, boolean>
  ): boolean {
    const confirm = form.get('confirmPassword');
    const password = form.get('password');
    const touched = submitted || blurredFields['confirmPassword'];
    const mismatch = password?.value && confirm?.value && password.value !== confirm.value;
    return touched && (!!confirm?.invalid || mismatch);
  }
  
  getNameError(form: FormGroup, submitted: boolean): string | null {
    const control = form.get('name');
    if (!control || (!control.touched && !submitted)) return null;

    if (control.hasError('required')) {
      return 'Please enter your name.';
    }

    if (control.hasError('minlength')) {
      return 'Name is too short.';
    }

    return null;
  }
  
  getEmailError(form: FormGroup, submitted: boolean): string | null {
    const control = form.get('email');
    if (!control || (!control.touched && !submitted)) return null;
    if (control.hasError('required')) return 'Please enter your email address.';
    if (control.hasError('pattern')) return 'Please enter a valid email address.';
    return null;
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
  
  getConfirmPasswordError(form: FormGroup, submitted: boolean): string | null {
    const control = form.get('confirmPassword');
    const password = form.get('password')?.value;
    if (!control || (!control.touched && !submitted)) return null;
    if (control.hasError('required') || control.value !== password) {
      return `Your passwords don't match. Please try again.`;
    }
    return null;
  }
  
  markControlsAsFailed(
    form: FormGroup, 
    controlNames: string | string[], 
    errorName: string = 'requestFailed'
  ): void {
    const controls = Array.isArray(controlNames) ? controlNames : [controlNames];
    controls.forEach(name => {
      const control = form.get(name);
      control?.setErrors({ [errorName]: true });
      control?.markAsTouched();
    });
  }
  
  clearFieldErrors(
    form: FormGroup, 
    controlNames: string | string[], 
    errorName: string = 'requestFailed'
  ): void {
    const controls = Array.isArray(controlNames) ? controlNames : [controlNames];
    controls.forEach(name => {
      const control = form.get(name);
      if (control?.hasError(errorName)) {
        const errors = { ...control.errors };
        delete errors[errorName];
        control.setErrors(Object.keys(errors).length ? errors : null);
      }
    });
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  };
}