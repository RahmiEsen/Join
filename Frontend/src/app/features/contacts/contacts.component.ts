import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../shared/services/contact.service';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  groupedContacts: { [key: string]: Contact[] } = {};

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getGuestContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.groupedContacts = this.groupByInitial(contacts);
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] + lastName[0]).toUpperCase();
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