import { CommonModule } from '@angular/common';
import { Component, Input, ViewChildren, ElementRef, QueryList, HostBinding  } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormHelperService } from '../../shared/form-helper.service';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})

export class FormFieldComponent {
  @ViewChildren('passwordInput') passwordInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Input() formFields: any[] = [];
  @Input() form!: FormGroup;
  @Input() formHelper!: FormHelperService;
  @Input() submitted!: boolean;
  @Input() blurredFields: Record<string, boolean> = {};
  @Input() passwordVisibility: Record<string, boolean> = {};
  @Input() ignoreNextBlur!: { value: boolean };
  @Input() customErrorMessages: Record<string, string | null> = {};
  @HostBinding('style.width') width = '100%';
}