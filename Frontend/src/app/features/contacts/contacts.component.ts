import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../shared/services/contact.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { Contact, getInitials } from '../../shared/models/contact.model';
import { FormHelperService } from '../../features/auth/services/form-utils.service';
import { AuthService } from '../../shared/services/auth.service';
import { SuccessSlideComponent } from '../../shared/ui/success-slide/success-slide.component';
import { ContactCardComponent } from './contact-card/contact-card.component';
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
    ContactCardComponent
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
  isMobileView = false;
  showDetails = false;
  showDropdown = false;
  @ViewChild(ContactCardComponent) contactCardComponent!: ContactCardComponent;
  
  constructor(
    private contactService: ContactService,
    private fb: FormBuilder,
    private eRef: ElementRef,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
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
      if (this.isMobileView) {
        this.afterContactCreationMobile(contact);
      } else {
        this.afterContactCreationDesktop(contact);
      }
    });
  }
  
  private afterContactCreationDesktop(contact: Contact) {
    this.closeOverlay();
    this.selectedContact = contact;
    this.showSuccessSlide('Contact successfully created');
    this.resetContactFormState();
  }
  
  private afterContactCreationMobile(contact: Contact) {
    this.closeOverlay();
    this.selectedContact = contact;
    this.showDetails = true;
    this.showSuccessSlide('Contact successfully created');
    this.resetContactFormState();
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
        if (this.isMobileView) {
          this.showDetails = false;
        }
      }, 400);
    } else {
      this.selectedContact = contact;
      this.isSlidingOut = false;
      if (this.isMobileView) {
        this.showDetails = true;
      }
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
      next: () => this.handleSuccessfulDeletion(contact),
      error: (err) => this.handleDeletionError(err),
    });
  }
  
  private handleSuccessfulDeletion(contact: Contact) {
    this.removeContactFromList(contact);
    this.updateGroupedContacts();
    this.handleSelectionAfterDeletion(contact);
  }
  
  private removeContactFromList(contact: Contact) {
    this.contacts = this.contacts.filter(c => c.id !== contact.id);
  }
  
  private updateGroupedContacts() {
    this.groupedContacts = this.groupByInitial(this.contacts);
  }
  
  private handleSelectionAfterDeletion(contact: Contact) {
    const isSelectedContact = this.selectedContact?.id === contact.id;
    const isEditedContact = this.contactToEdit?.id === contact.id;
    if (isSelectedContact) {
      this.selectedContact = null;
      if (this.isMobileView) {
        this.showDetails = false;
      }
    }
    if (isEditedContact) {
      this.closeOverlay();
      this.resetContactFormState();
    }
  }
  
  private handleDeletionError(error: any) {
    console.error('Fehler beim Löschen:', error);
    alert('Kontakt konnte nicht gelöscht werden.');
  }
  
  private resetContactFormState(): void {
    this.isEditMode = false;
    this.contactToEdit = undefined;
    this.contactForm.reset();
    this.submitted = false;
    this.isSubmitting = false;
    // **WICHTIG:** Setzt auch die Dateiauswahl in der Kind-Komponente zurück
    if (this.contactCardComponent) {
      this.contactCardComponent['resetFileInput']();
    }
  }
  
  editContact() {
    if (!this.contactToEdit) return;
    this.submitted = true;
    if (this.contactForm.invalid) return;
    const formData = this.contactForm.value;
    const { firstName, lastName } = this.splitName(formData.name);
    const payload = {
      firstName,
      lastName,
      email: formData.email,
      phoneNumber: formData.phone,
    };
    const selectedFile = this.contactCardComponent.selectedFile;
    this.contactService.editContact(this.contactToEdit.id, payload, selectedFile ?? undefined).subscribe({
      next: (updatedContact) => {
        const index = this.contacts.findIndex(c => c.id === updatedContact.id);
        if (index !== -1) this.contacts[index] = updatedContact;
        this.groupedContacts = this.groupByInitial(this.contacts);
        this.selectedContact = updatedContact;
        this.closeOverlay();
        this.showSuccessSlide('Contact successfully updated');
      },
      error: (err) => {
        console.error('Fehler beim Bearbeiten des Kontakts:', err);
        alert('Kontakt konnte nicht aktualisiert werden.');
      }
    });
  }
  
  createContact() {
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
    const selectedFile = this.contactCardComponent.selectedFile;
    this.contactService.createContact(payload, selectedFile ?? undefined).subscribe({
      next: (newContact) => {
        this.handleSuccess(newContact);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Fehler beim Erstellen des Kontakts:', err);
        alert('Kontakt konnte nicht erstellt werden.');
        this.isSubmitting = false;
      }
    });
  }
  
  checkScreenSize() {
    this.isMobileView = window.innerWidth <= 1024;
  }
  
  closeDetails() {
    this.showDetails = false;
  }
  
  backToContacts(): void {
    this.showDetails = false;
    this.selectedContact = null;
  }
  
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isDropdown = target.closest('.dropdown-menu');
    const isButton = target.closest('.options-btn');
    if (!isDropdown && !isButton) {
      this.showDropdown = false;
    }
  }
}