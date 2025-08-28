import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../../../shared/models/contact.model';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-selected-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-members.component.html',
  styleUrl: './selected-members.component.scss'
})

export class SelectedMembersComponent {
  @Input() members: Contact[] = [];
  @Output() memberAreaClicked = new EventEmitter<void>();
  public backendUrl = environment.apiUrl;
  private colorCache: { [key: string]: string } = {};
  
  getInitials(contact: Contact): string {
    const firstNameInitial = contact.firstName ? contact.firstName[0] : '';
    const lastNameInitial = contact.lastName ? contact.lastName[0] : '';
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  }
  
  getMemberColor(contact: Contact): string {
    if (contact.color) {
      return contact.color;
    }
    const key = contact.id || contact.firstName + contact.lastName;
    if (!this.colorCache[key]) {
      let hash = 0;
      const str = contact.firstName + contact.lastName;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let color = '#';
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).slice(-2);
      }
      this.colorCache[key] = color;
    }
    return this.colorCache[key];
  }
  
  onMembersClick(): void {
    this.memberAreaClicked.emit();
  }
}