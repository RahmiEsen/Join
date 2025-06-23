import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../shared/services/contact.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { Contact, getInitials } from '../../shared/models/contact.model';
import { FormHelperService } from '../../features/auth/services/form-utils.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ContactListComponent,
    ContactDetailsComponent,
    FormFieldComponent,
    ReactiveFormsModule,
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
  
  constructor(
    private contactService: ContactService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.contactService.getGuestContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.groupedContacts = this.groupByInitial(contacts);
    });
    this.initContactForm();
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
  
  onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      const data = this.contactForm.value;
      console.log('Kontakt-Daten:', data);
      // Speichern oder verwenden
      this.closeOverlay();
      this.contactForm.reset();
      this.submitted = false;
    }
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
    this.showOverlay = true;
    this.isOverlaySlidingOut = false;
  }
  
  closeOverlay() {
    this.isOverlaySlidingOut = true;
    setTimeout(() => {
      this.showOverlay = false;
      this.isOverlaySlidingOut = false;
    }, 400);
  }
}