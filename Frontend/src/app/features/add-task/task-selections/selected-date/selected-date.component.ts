import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selected-date',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-date.component.html',
  styleUrl: './selected-date.component.scss'
})

export class SelectedDateComponent {
  @Input() startDate: Date | null = null;
  @Input() endDate: Date | null = null;
  
  get title(): string {
    if (this.startDate && this.endDate) {
      return 'Date';
    }
    if (this.startDate) {
      return 'Start date';
    }
    if (this.endDate) {
      return 'Deadline';
    }
    return '';
  }
}