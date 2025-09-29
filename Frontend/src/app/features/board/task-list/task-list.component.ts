import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card/task-card.component';
import { AddTaskFormComponent } from './add-task-form/add-task-form.component';
import { Task } from '../../../shared/services/task.service';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

interface BoardList {
  id: string;
  title: string;
  tasks: Task[];
}

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
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() listId: string = '';
  @Input() isMenuOpen: boolean = false;
  @Input() connectedListIds: string[] = [];
  @Input() currentPosition: number = 1;
  @Input() totalLists: number = 0;
  @Input() allLists: BoardList[] = [];
  @Output() editTaskRequest = new EventEmitter<Task>();
  @Output() addTaskRequest = new EventEmitter<string>();
  @Output() titleChanged = new EventEmitter<{
    listId: string;
    newTitle: string;
  }>();
  @Output() menuToggled = new EventEmitter<string>();
  @Output() deleteListRequested = new EventEmitter<string>();
  @Output() taskDropped = new EventEmitter<CdkDragDrop<Task[]>>();
  @Output() moveListRequest = new EventEmitter<{
    listId: string;
    newPosition: number;
  }>();
  @Output() taskMoveRequest = new EventEmitter<{
    taskId: string;
    targetListId: string;
    newPosition: number;
  }>();
  @ViewChild('titleInput') titleInput!: ElementRef;

  public isEditingTitle: boolean = false;
  public editedTitle: string = '';
  public dropdownState: 'main' | 'move' = 'main';
  public isPositionSelectorOpen: boolean = false;
  public selectedPosition: number = 1;
  public availablePositions: number[] = [];
  public isDragDisabled = window.innerWidth <= 768;

  constructor() {}

  ngOnInit(): void {
    this.editedTitle = this.title;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) {
      this.editedTitle = this.title;
    }
    if (changes['isMenuOpen'] && !changes['isMenuOpen'].currentValue) {
      this.dropdownState = 'main';
      this.isPositionSelectorOpen = false;
    }
    if (changes['currentPosition'] || changes['totalLists']) {
      this.selectedPosition = this.currentPosition;
      this.availablePositions = Array.from(
        { length: this.totalLists },
        (_, i) => i + 1
      );
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

  openMoveList(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownState = 'move';
  }

  goBackToMainMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownState = 'main';
    this.isPositionSelectorOpen = false;
  }

  togglePositionSelector(event: MouseEvent): void {
    event.stopPropagation();
    this.isPositionSelectorOpen = !this.isPositionSelectorOpen;
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

  selectPosition(position: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedPosition = position;
    this.isPositionSelectorOpen = false;
  }

  onMoveList(): void {
    if (this.selectedPosition !== this.currentPosition) {
      this.moveListRequest.emit({
        listId: this.listId,
        newPosition: this.selectedPosition - 1,
      });
    }
    this.menuToggled.emit(this.listId);
  }

  onTaskMoveRequested(event: {
    taskId: string;
    targetListId: string;
    newPosition: number;
  }): void {
    this.taskMoveRequest.emit(event);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isDragDisabled = window.innerWidth <= 768;
  }

  handleTaskDelete(taskId: string): void {
    console.log(
      `Die Task-Liste hat die Löschanfrage für Task-ID erhalten: ${taskId}`
    );
  }
}
