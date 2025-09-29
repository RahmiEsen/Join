import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../shared/services/task.service';
import { environment } from '../../../../../environments/environment.prod';
import { OverlayModule } from '@angular/cdk/overlay';

interface BoardList {
  id: string;
  title: string;
  tasks: Task[];
}

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements OnInit, OnChanges {
  @Input() task!: Task;
  @Input() listId!: string;
  @Input() currentPosition!: number;
  @Input() allLists: BoardList[] = [];
  @Output() openEditRequest = new EventEmitter<Task>();
  @Output() moveTaskRequest = new EventEmitter<{
    taskId: string;
    targetListId: string;
    newPosition: number;
  }>();
  @Output() deleteTaskRequest = new EventEmitter<string>();

  public backendUrl = environment.apiUrl;
  public areLabelsVisible: boolean = false;
  public isMenuOpen: boolean = false;
  public dropdownState: 'main' | 'move' = 'main';
  public isListSelectorOpen: boolean = false;
  public isPositionSelectorOpen: boolean = false;
  public selectedListId: string = '';
  public selectedPosition: number = 1;
  public availablePositions: number[] = [];
  public closeDropdown(): void {
    this.isMenuOpen = false;
    this.dropdownState = 'main';
    this.isListSelectorOpen = false;
    this.isPositionSelectorOpen = false;
  }

  ngOnInit(): void {
    this.resetSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listId'] || changes['currentPosition']) {
      this.resetSelection();
    }
  }

  private resetSelection(): void {
    this.selectedListId = this.listId;
    this.selectedPosition = this.currentPosition;
    this.updateAvailablePositions();
  }

  private updateAvailablePositions(): void {
    const selectedList = this.getSelectedList();
    if (selectedList) {
      const taskCount = selectedList.tasks.length;
      const length =
        this.selectedListId === this.listId ? taskCount : taskCount + 1;
      this.availablePositions = Array.from(
        { length: length > 0 ? length : 1 },
        (_, i) => i + 1
      );
    }
  }

  public getSelectedList(): BoardList | undefined {
    return this.allLists.find((list) => list.id === this.selectedListId);
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.dropdownState = 'main';
      this.isListSelectorOpen = false;
      this.isPositionSelectorOpen = false;
    }
  }

  openMoveView(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownState = 'move';
  }

  goBackToMainMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownState = 'main';
  }

  toggleListSelector(event: MouseEvent): void {
    event.stopPropagation();
    this.isListSelectorOpen = !this.isListSelectorOpen;
    this.isPositionSelectorOpen = false;
  }

  selectList(listId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedListId = listId;
    this.isListSelectorOpen = false;
    this.selectedPosition = 1;
    this.updateAvailablePositions();
  }

  togglePositionSelector(event: MouseEvent): void {
    event.stopPropagation();
    this.isPositionSelectorOpen = !this.isPositionSelectorOpen;
    this.isListSelectorOpen = false;
  }

  selectPosition(position: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedPosition = position;
    this.isPositionSelectorOpen = false;
  }

  onMoveTask(): void {
    if (
      this.selectedListId !== this.listId ||
      this.selectedPosition !== this.currentPosition
    ) {
      this.moveTaskRequest.emit({
        taskId: this.task.id,
        targetListId: this.selectedListId,
        newPosition: this.selectedPosition - 1,
      });
    }
    this.isMenuOpen = false;
  }

  deleteTask(event: MouseEvent): void {
    event.stopPropagation();
    this.deleteTaskRequest.emit(this.task.id);
    this.closeDropdown();
  }

  onOpenEdit(): void {
    if (!this.isMenuOpen) {
      this.openEditRequest.emit(this.task);
    }
  }

  toggleLabels(event: MouseEvent): void {
    event.stopPropagation();
    this.areLabelsVisible = !this.areLabelsVisible;
  }

  public formatDateRange(task: Task): string {
    const formattedStart = this.getFormattedDate(task.startDate);
    const formattedDue = this.getFormattedDate(task.dueDate);
    if (formattedStart && formattedDue)
      return `${formattedStart} - ${formattedDue}`;
    if (formattedDue) return formattedDue;
    if (formattedStart) return formattedStart;
    return '';
  }

  private getFormattedDate(dateString?: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const year = date.getFullYear();
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(
      date
    );
    return year === currentYear
      ? `${day}.${month}`
      : `${day}.${month}. ${year}`;
  }

  public getChecklistProgress(task: Task): string {
    if (!task.checklists || task.checklists.length === 0) return '';
    const totalItems = task.checklists.reduce(
      (sum, cl) => sum + cl.items.length,
      0
    );
    const completedItems = task.checklists.reduce(
      (sum, cl) => sum + cl.items.filter((item) => item.isCompleted).length,
      0
    );
    return `${completedItems}/${totalItems}`;
  }

  public getInitials(firstName?: string, lastName?: string): string {
    if (!firstName || !lastName) return '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
