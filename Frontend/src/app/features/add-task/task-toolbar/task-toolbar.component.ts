import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { LabelSelectorComponent } from './label-selector/label-selector.component';
import { CommonModule } from '@angular/common';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { ChecklistSelectorComponent } from './checklist-selector/checklist-selector.component';
import { MemberSelectorComponent } from './member-selector/member-selector.component';
import { Contact } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-task-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    DropdownComponent,
    LabelSelectorComponent,
    DateSelectorComponent,
    ChecklistSelectorComponent,
    MemberSelectorComponent
  ],
  templateUrl: './task-toolbar.component.html',
  styleUrl: './task-toolbar.component.scss'
})

export class TaskToolbarComponent {
  @Input() selectedLabels: string[] = [];
  @Input() allContacts: Contact[] = [];
  @Output() selectedLabelsChange = new EventEmitter<string[]>();
  @Output() dateSelected = new EventEmitter<{ startDate: Date | null; endDate: Date | null }>();
  @Output() availableLabelsChange = new EventEmitter<any[]>();
  @Output() checklistCreated = new EventEmitter<string>();
  @Output() dateCleared = new EventEmitter<void>();
  @Output() selectedMembersChange = new EventEmitter<Contact[]>();
  @Output() memberSelected = new EventEmitter<Contact>();
  @ViewChild('labelSelector') labelSelector?: LabelSelectorComponent;
  @ViewChild('labelDropdown') labelDropdown!: DropdownComponent;
  @ViewChild('dateDropdownRef') dateDropdownRef!: DropdownComponent;
  @ViewChild('memberDropdown') memberDropdown!: DropdownComponent;
  
  labelTitle = 'Labels';
  selectedMembers: Contact[] = [];
  
  handleChecklistCreated(title: string): void {
    this.checklistCreated.emit(title);
  }
  
  public openLabelDropdown(): void {
    this.labelDropdown.toggle();
  }
  
  public openDateDropdown(): void {
    this.dateDropdownRef.toggle();
  }
  
  public openMemberDropdown(): void {
    this.memberDropdown.toggle();
  }
  
  updateMembers(selectedContacts: Contact[]) {
    this.selectedMembers = selectedContacts;
    this.selectedMembersChange.emit(this.selectedMembers);
  }
  
  addMember(contact: Contact) {
    if (!this.selectedMembers.some(c => c.id === contact.id)) {
      this.selectedMembers.push(contact);
      this.selectedMembersChange.emit(this.selectedMembers);
    }
  }
}