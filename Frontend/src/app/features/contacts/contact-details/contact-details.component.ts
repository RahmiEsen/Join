import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact, getInitials } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss'
})

export class ContactDetailsComponent {
  @Input() contact!: Contact;
  @Input() isSlidingOut: boolean = false;
  @Input() getInitials = getInitials;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}