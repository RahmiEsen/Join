import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../shared/services/contact.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { Contact, getInitials } from '../../shared/models/contact.model';
import { FormHelperService } from '../../features/auth/services/form-utils.service';
import { AuthService } from '../../shared/services/auth.service';
import { SuccessSlideComponent } from '../../shared/ui/success-slide/success-slide.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { getRandomColor } from '../../shared/utils/color.util';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ContactListComponent,
    ContactDetailsComponent,
    ReactiveFormsModule,
    SuccessSlideComponent,
    AddContactComponent
  ],
  providers: [FormHelperService],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})

export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  groupedContacts: { [key: string]: Contact[] } = {};
  selectedContact: Contact | null = null;
  isSlidingOut = false;
  showOverlay = false;
  isOverlaySlidingOut = false;
  getInitials = getInitials;
  contactForm!: FormGroup;
  formFields = [
    { placeholder: 'Name', type: 'text', icon: 'person.png', alt: 'Name' },
    { placeholder: 'Email', type: 'email', icon: 'mail.png', alt: 'E-Mail' },
    { placeholder: 'Phone', type: 'tel', icon: 'phone.png', alt: 'Telefon' }
  ];
  submitted = false;
  formHelper = new FormHelperService();
  userId: string | null = null;
  isGuest = true;
  guestContacts: Contact[] = [];
  showSuccess = false;
  visible = true;
  slideOutSuccess = false;
  successMessage = '';
  isSubmitting = false;
  isEditMode = false;
  contactToEdit?: Contact;
  
  constructor(
    private contactService: ContactService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user && user.id && user.id !== 'guest') {
      this.userId = user.id;
      this.isGuest = false;
      this.contactService.getUserContacts(user.id).subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
        this.groupedContacts = this.groupByInitial(contacts);
      });
    } else {
      this.isGuest = true;
      this.userId = 'guest';
      this.contactService.getGuestContacts().subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
        this.groupedContacts = this.groupByInitial(contacts);
      });
    }
    this.initContactForm();
  }
  
  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitted = true;
    if (this.contactForm.invalid) {
      this.isSubmitting = false;
      return;
    }
    const formData = this.contactForm.value;
    const { firstName, lastName } = this.splitName(formData.name);
    const payload = this.buildPayload(firstName, lastName, formData);
    this.contactService.createContact(payload).subscribe({
      next: (newContact) => {
        this.handleSuccess(newContact);
        this.isSubmitting = false;
      },
      error: () => {
        alert('Kontakt konnte nicht erstellt werden.');
        this.isSubmitting = false;
      }
    });
  }
  
  private splitName(fullName: string) {
    const [first, ...rest] = fullName.trim().split(' ');
    return { firstName: first, lastName: rest.join(' ') || '' };
  }
  
  private buildPayload(firstName: string, lastName: string, data: any) {
    const payload: any = {
      firstName,
      lastName,
      email: data.email,
      phoneNumber: data.phone,
      isGuest: this.isGuest,
      color: getRandomColor()
    };
    payload.ownerId = this.isGuest ? 'guest' : this.userId;
    return payload;
  }
  
  private handleSuccess(contact: Contact) {
    const loadContacts = this.isGuest
      ? this.contactService.getGuestContacts()
      : this.contactService.getUserContacts(this.userId!);
    loadContacts.subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.groupedContacts = this.groupByInitial(this.contacts);
    });
    this.closeOverlay();
    this.contactForm.reset();
    this.submitted = false;
    this.closeOverlayAndShowSuccess('Contact successfully created', contact);
  }
  
  initContactForm() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\+?[0-9\s\-()]{6,}$/)
      ]]
    });
  }
  
  onSelectContact(contact: Contact) {
    if (this.selectedContact?.id === contact.id) {
      this.isSlidingOut = true;
      setTimeout(() => {
        this.selectedContact = null;
        this.isSlidingOut = false;
      }, 400);
    } else {
      this.selectedContact = contact;
      this.isSlidingOut = false;
    }
  }
  
  private groupByInitial(contacts: Contact[]): { [key: string]: Contact[] } {
    const sorted = contacts.sort((a, b) =>
      (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
    );
    return sorted.reduce((group, contact) => {
      const letter = contact.firstName.charAt(0).toUpperCase();
      group[letter] = group[letter] ?? [];
      group[letter].push(contact);
      return group;
    }, {} as { [key: string]: Contact[] });
  }
  
  addContact() {
    this.resetContactFormState();
    this.showOverlay = true;
    this.isOverlaySlidingOut = false;
  }
  
  closeOverlay() {
    this.isOverlaySlidingOut = true;
    setTimeout(() => {
      this.showOverlay = false;
      this.isOverlaySlidingOut = false;
    }, 300);
  }
  
  private closeOverlayAndShowSuccess(message: string, contact: Contact): void {
    this.closeOverlay();
    setTimeout(() => {
      this.selectedContact = contact;
      this.showSuccessSlide(message);
    }, 300);
  }
  
  showSuccessSlide(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    this.slideOutSuccess = false;
    setTimeout(() => {
      this.slideOutSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
        this.successMessage = '';
        this.slideOutSuccess = false;
      }, 400);
    }, 2600);
  }
  
  onEditContact() {
    if (!this.selectedContact) return;
    this.isEditMode = true;
    this.contactToEdit = this.selectedContact;
    this.contactForm.patchValue({
      name: `${this.selectedContact.firstName} ${this.selectedContact.lastName}`,
      email: this.selectedContact.email,
      phone: this.selectedContact.phoneNumber,
    });
    this.showOverlay = true;
  }
  
  deleteContact(contact: Contact) {
    this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.groupedContacts = this.groupByInitial(this.contacts);

        if (this.selectedContact?.id === contact.id) this.selectedContact = null;
        if (this.contactToEdit?.id === contact.id) {
          this.closeOverlay();
          this.resetContactFormState();
        }
      },
      error: (err) => {
        console.error('Fehler beim Löschen:', err);
      },
    });
  }
  
  private resetContactFormState(): void {
    this.isEditMode = false;
    this.contactToEdit = undefined;
    this.contactForm.reset();
    this.submitted = false;
    this.isSubmitting = false;
  }
  
  editContact() {
    if (!this.contactToEdit) return;
    const formData = this.contactForm.value;
    const { firstName, lastName } = this.splitName(formData.name);
    const payload = {
      firstName,
      lastName,
      email: formData.email,
      phoneNumber: formData.phone,
      color: this.contactToEdit.color,
      ownerId: this.contactToEdit.ownerId
    };
    this.contactService.editContact(this.contactToEdit.id, payload).subscribe({
      next: (editContact) => {
        const index = this.contacts.findIndex(c => c.id === editContact.id);
        if (index !== -1) this.contacts[index] = editContact;
        this.groupedContacts = this.groupByInitial(this.contacts);
        this.closeOverlay();
        this.resetContactFormState();
      },
      error: () => alert('Kontakt konnte nicht aktualisiert werden.')
    });
  }
  
  createContact() {
    this.onSubmit();
  }
}