import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ViewChildren, ElementRef, QueryList  } from '@angular/core';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormHelperService } from '../../../features/auth/services/form-utils.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})

export class AuthFormComponent {
  @Input() formType: 'login' | 'signup' | 'forgot' | 'reset' = 'login';
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Input() formFields: any[] = [];
  @Input() form!: FormGroup;
  @Input() formHelper!: FormHelperService;
  @Input() submitted!: boolean;
  @Input() blurredFields: Record<string, boolean> = {};
  @Input() passwordVisibility: Record<string, boolean> = {};
  @Input() ignoreNextBlur!: { value: boolean };
  @Input() customErrorMessages: Record<string, string | null> = {};
  @Input() loginFailed: boolean = false;
  @Input() showForgotPassword = false;
  @Input() showGoogleLogin = false;
  @Input() showRememberMe = false;
  @Input() showPrivacyCheckbox = false;
  @Input() showPrivacyError = false;
  @Input() submitButtonText: string = 'Submit';
  @Input() showGuestButton = false;
  @Input() buttonWrapperClass = '';
  @Output() formSubmit = new EventEmitter<void>();
  @Output() googleLogin = new EventEmitter<void>();
  @Output() guestLogin = new EventEmitter<void>();
  @Output() goToForgotPassword = new EventEmitter<void>();
  @HostBinding('style.width') width = '100%';
}