import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent
  ],
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})

export class AddContactComponent {
  @Input() showOverlay = false;
  @Input() isOverlaySlidingOut = false;
  @Input() contactForm!: FormGroup;
  @Input() formFields: any[] = [];
  @Input() formHelper: any;
  @Input() submitted = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  
  closeOverlay() {
    this.close.emit();
  }
  
  emitSubmit() {
    this.submit.emit();
  }
}