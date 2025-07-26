import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checklist-selector',
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './checklist-selector.component.html',
  styleUrl: './checklist-selector.component.scss'
})

export class ChecklistSelectorComponent {
  @Output() checklistCreated = new EventEmitter<string>();
  @Output() closeRequested = new EventEmitter<void>();
  
  title: string = '';
  
  emitChecklist(): void {
    const trimmed = this.title.trim();
    if (trimmed) {
      this.checklistCreated.emit(trimmed);
      this.title = '';
      this.closeRequested.emit();
    }
  }
}