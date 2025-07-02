import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ContactButtonWrapperComponent } from '../contact-button-wrapper/contact-button-wrapper.component';
import { Contact, getInitials } from '../../../shared/models/contact.model';
import { getRandomColor } from '../../../shared/utils/color.util';

@Component({
  selector: 'app-contact-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    ContactButtonWrapperComponent,
  ],
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss']
})

export class ContactCardComponent {
  @Input() showOverlay = false;
  @Input() isOverlaySlidingOut = false;
  @Input() contactForm!: FormGroup;
  @Input() formFields: any[] = [];
  @Input() formHelper: any;
  @Input() submitted = false;
  @Input() isEditMode: boolean = false;
  @Input() contactToEdit?: Contact;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  
  getInitials = getInitials;
  newContactColor = getRandomColor();
  
  closeOverlay() {
    this.close.emit();
  }
  
  createContact() {
    this.create.emit();
  }
  
  updateContact() {
    this.edit.emit();
  }
  
  emitDelete() {
    this.delete.emit();
  }
}