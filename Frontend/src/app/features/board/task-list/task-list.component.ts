import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { AddTaskFormComponent } from './add-task-form/add-task-form.component';
import { Task } from '../../../shared/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    AddTaskFormComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Output() editTaskRequest = new EventEmitter<Task>();
  @Output() addTaskRequest = new EventEmitter<string>();
  
  onOpenTaskEdit(task: Task): void {
    this.editTaskRequest.emit(task);
  }
  
  onAddTask(title: string): void {
    this.addTaskRequest.emit(title);
  }
}