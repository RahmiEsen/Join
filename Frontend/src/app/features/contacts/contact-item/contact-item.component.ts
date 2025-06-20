import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  standalone: true,
  selector: 'app-contact-item',
  imports: [CommonModule],
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
})

export class ContactItemComponent {
  @Input() contact!: Contact;
  @Input() isActive: boolean = false;
  @Input() getInitials!: (first: string, last: string) => string;
  @Output() contactClicked = new EventEmitter<void>();
}