import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { AddTaskFormComponent } from './add-task-form/add-task-form.component';
import { Task } from '../../../shared/services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    AddTaskFormComponent,
    FormsModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() listId: string = '';
  @Output() editTaskRequest = new EventEmitter<Task>();
  @Output() addTaskRequest = new EventEmitter<string>();
  @Output() titleChanged = new EventEmitter<{ listId: string; newTitle: string }>();
  
  public isEditing: boolean = false;
  public editedTitle: string = '';
  
  onTitleUpdated(): void {
    console.log('Neuer Titel:', this.title);
  }
  
  startEditing(): void {
    this.editedTitle = this.title;
    this.isEditing = true;
  }
  
  saveTitle(): void {
    const newTitle = this.editedTitle.trim();
    if (newTitle && newTitle !== this.title) {
      this.titleChanged.emit({ listId: this.listId, newTitle });
    }
    this.isEditing = false;
  }
  
  onOpenTaskEdit(task: Task): void {
    this.editTaskRequest.emit(task);
  }
  
  onAddTask(title: string): void {
    this.addTaskRequest.emit(title);
  }
}