import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedDateComponent } from './selected-date/selected-date.component';
import { SelectedLabelComponent } from './selected-label/selected-label.component';
import { SelectedMembersComponent } from './selected-members/selected-members.component';
import { Contact } from '../../../shared/models/contact.model';

@Component({
  selector: 'app-task-selections',
  standalone: true,
  imports: [
    CommonModule,
    SelectedDateComponent, 
    SelectedLabelComponent,
    SelectedMembersComponent
  ],
  templateUrl: './task-selections.component.html',
  styleUrl: './task-selections.component.scss'
})

export class TaskSelectionsComponent {
  @Input() selectedLabels: string[] = [];
  @Input() availableLabels: any[] = [];
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  @Output() labelAreaClicked = new EventEmitter<void>();
  @Output() dateAreaClicked = new EventEmitter<void>();
  @Output() memberAreaClicked = new EventEmitter<void>();
  @Input() selectedMembers: Contact[] = [];
  
  onLabelClick(): void {
    this.labelAreaClicked.emit();
  }
  
  onDateClick(): void {
    this.dateAreaClicked.emit();
  }
  
  onMemberAreaClick(): void {
    this.memberAreaClicked.emit();
  }
}