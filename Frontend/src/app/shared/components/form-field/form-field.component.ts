import { CommonModule } from '@angular/common';
import { Component, Input, ViewChildren, ElementRef, QueryList, HostBinding  } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormHelperService } from '../../../features/auth/services/form-utils.service';

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
  
  onInputChange(event: Event, field: any): void {
    const input = event.target as HTMLInputElement;
    const controlName = this.formHelper.getControlName(field.placeholder);
    if (controlName === 'phone') {
      let raw = input.value.replace(/[^\d+]/g, '');

      // Umwandlung: 0049 oder 049 oder 0 → +49
      if (raw.startsWith('0049')) {
        raw = '+49' + raw.slice(4);
      } else if (raw.startsWith('049')) {
        raw = '+49' + raw.slice(3);
      } else if (raw.startsWith('0')) {
        raw = '+49' + raw.slice(1);
      }

      // Formatieren, wenn mind. 6 Ziffern vorhanden
      const match = raw.match(/^(\+49)(\d{3})(\d{0,})$/);
      let formatted = raw;
      if (match) {
        const [, country, area, rest] = match;
        formatted = `${country} ${area} ${rest}`.trim();
      }
      this.form.get(controlName)?.setValue(formatted, { emitEvent: false });
      input.value = formatted;
    }
  }
}