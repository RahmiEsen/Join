import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared/services/task.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})

export class TaskCardComponent {
  @Input() task!: Task;
  @Output() openEditRequest = new EventEmitter<Task>();
  public backendUrl = environment.apiUrl;

  areLabelsVisible: boolean = false;
  
  onOpenEdit(): void {
    this.openEditRequest.emit(this.task);
  }
  
  toggleLabels(event: MouseEvent): void {
    event.stopPropagation();
    this.areLabelsVisible = !this.areLabelsVisible;
  }
  
  public formatDateRange(task: Task): string {
    const formattedStart = this.getFormattedDate(task.startDate);
    const formattedDue = this.getFormattedDate(task.dueDate);
    if (formattedStart && formattedDue) {
      return `${formattedStart} - ${formattedDue}`;
    }
    if (formattedDue) {
      return formattedDue;
    }
    if (formattedStart) {
      return formattedStart;
    }
    return '';
  }
  
  private getFormattedDate(dateString?: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const year = date.getFullYear();
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date);
    if (year === currentYear) {
      return `${day}.${month}`;
    } else {
      return `${day}.${month}. ${year}`;
    }
  }
  
  public getChecklistProgress(task: Task): string {
    if (!task.checklists || task.checklists.length === 0) return '';
    const totalItems = task.checklists.reduce((sum, checklist) => sum + checklist.items.length, 0);
    const completedItems = task.checklists.reduce((sum, checklist) => sum + checklist.items.filter((item) => item.isCompleted).length, 0);
    return `${completedItems}/${totalItems}`;
  }
}