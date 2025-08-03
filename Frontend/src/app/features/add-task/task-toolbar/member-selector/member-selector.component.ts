import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../../shared/models/contact.model';
import { ContactService } from '../../../../shared/services/contact.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ContactItemComponent } from '../../../contacts/contact-item/contact-item.component';

@Component({
  selector: 'app-member-selector',
  standalone: true,
  imports: [CommonModule, ContactItemComponent],
  templateUrl: './member-selector.component.html',
  styleUrl: './member-selector.component.scss'
})

export class MemberSelectorComponent implements OnInit, OnChanges {
  @Input() contacts: Contact[] = [];
  @Input() initialSelection: Contact[] = [];
  @Output() selectionChange = new EventEmitter<Contact[]>(); 
  
  isLoading = true;
  selectedContacts: Contact[] = [];
  
  constructor(
    private contactService: ContactService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadContacts();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialSelection']) {
      this.selectedContacts = [...this.initialSelection];
    }
  }
  
  loadContacts(): void {
    this.isLoading = true;
    const user = this.authService.getUser();
    const contactsObservable = (user && user.id && user.id !== 'guest')
      ? this.contactService.getUserContacts(user.id)
      : this.contactService.getGuestContacts();
    contactsObservable.subscribe({
      next: (fetchedContacts) => {
        this.contacts = fetchedContacts;
        this.isLoading = false;
        console.log('Contacts loaded:', this.contacts);
      },
      error: (err) => {
        console.error('Failed to load contacts', err);
        this.isLoading = false;
      }
    });
  }
  
  getInitials(first: string, last: string): string {
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`;
  }
  
  selectMember(contact: Contact): void {
    const index = this.selectedContacts.findIndex(c => c.id === contact.id);
    
    if (index > -1) {
      // ERZEUGE NEUES ARRAY: Filtere den Kontakt heraus, der entfernt werden soll
      this.selectedContacts = this.selectedContacts.filter(c => c.id !== contact.id);
    } else {
      // ERZEUGE NEUES ARRAY: Erstelle eine Kopie und füge den neuen Kontakt hinzu
      this.selectedContacts = [...this.selectedContacts, contact];
    }
    
    // Gib die Referenz auf das brandneue Array weiter
    this.selectionChange.emit(this.selectedContacts);
  }
  
  isSelected(contact: Contact): boolean {
    return this.selectedContacts.some(c => c.id === contact.id);
  }
}