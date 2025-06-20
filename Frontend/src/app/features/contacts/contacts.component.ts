import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../shared/services/contact.service';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { Contact, getInitials } from '../../shared/models/contact.model';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactListComponent, ContactDetailsComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})

export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  groupedContacts: { [key: string]: Contact[] } = {};
  selectedContact: Contact | null = null;
  isSlidingOut = false;
  getInitials = getInitials;
  
  constructor(private contactService: ContactService) {}
  
  ngOnInit(): void {
    this.contactService.getGuestContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.groupedContacts = this.groupByInitial(contacts);
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
}