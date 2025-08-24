import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { AddTaskFormComponent } from './add-task-form/add-task-form.component';
import { Task } from '../../../shared/services/task.service';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskCardComponent,
    AddTaskFormComponent,
    FormsModule,
    DragDropModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() listId: string = '';
  @Output() editTaskRequest = new EventEmitter<Task>();
  @Output() addTaskRequest = new EventEmitter<string>();
  @Output() titleChanged = new EventEmitter<{ listId: string; newTitle: string }>();
  @Input() isMenuOpen: boolean = false;
  @Output() menuToggled = new EventEmitter<string>();
  @Output() deleteListRequested = new EventEmitter<string>();
  @Input() connectedListIds: string[] = [];
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();
  @ViewChild('titleInput') titleInput!: ElementRef;
  
  public isEditingTitle: boolean = false;
  public editedTitle: string = '';
  
  constructor() {}
  
  ngOnInit(): void {
    this.editedTitle = this.title;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) {
      this.editedTitle = this.title;
    }
  }
  
  enableTitleEdit(): void {
    this.isEditingTitle = true;
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
      this.titleInput.nativeElement.select();
    }, 0);
  }
  
  saveTitle(): void {
    this.isEditingTitle = false;
    const newTitle = this.editedTitle.trim();
    if (newTitle && newTitle !== this.title) {
      this.titleChanged.emit({ listId: this.listId, newTitle });
    }
  }
  
  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.menuToggled.emit(this.listId);
  }
  
  onOpenTaskEdit(task: Task): void {
    this.editTaskRequest.emit(task);
  }
  
  onAddTask(title: string): void {
    this.addTaskRequest.emit(title);
  }
  
  onDeleteList(): void {
    this.deleteListRequested.emit(this.listId);
  }
  
  onTaskDropped(event: CdkDragDrop<Task[]>): void {
    this.taskDropped.emit(event);
  }
}