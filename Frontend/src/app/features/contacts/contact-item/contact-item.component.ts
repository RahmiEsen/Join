import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact } from '../../../shared/models/contact.model';

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