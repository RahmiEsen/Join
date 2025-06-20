import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactItemComponent } from "../contact-item/contact-item.component";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule, ContactItemComponent],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})

export class ContactListComponent {
  @Input() contacts: Contact[] = [];
  @Input() selectedContact: Contact | null = null;
  @Input() getInitials!: (first: string, last: string) => string;
  @Output() contactSelected = new EventEmitter<Contact>();
  @Input() groupedContacts: { [letter: string]: Contact[] } = {};
  @Output() select = new EventEmitter<Contact>();
  
  onSelectContact(contact: Contact) {
    this.select.emit(contact);
  }
}