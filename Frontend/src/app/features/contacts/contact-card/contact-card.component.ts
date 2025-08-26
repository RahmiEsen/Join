import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
export class ContactCardComponent implements OnChanges {
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

  public selectedFile: File | null = null;
  public imagePreviewUrl: string | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showOverlay'] && !this.showOverlay) {
      this.resetFileInput();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  hasImage(): boolean {
    return !!this.imagePreviewUrl || !!this.contactToEdit?.profilePicture;
  }

  private resetFileInput(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }
  
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