import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorConfig } from '../add-task.models';

@Component({
  selector: 'app-task-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskHeaderComponent {
  @Input() selectedColor: ColorConfig | null = null;
  @Input() selectedCoverImageForHeader: string | null = null;
  @Output() toggleMenuRequest = new EventEmitter<void>();
  @Output() closeTaskRequest = new EventEmitter<void>();
  
  onToggleMenu(): void {
    this.toggleMenuRequest.emit();
  }
  
  onCloseTask(): void {
    this.closeTaskRequest.emit();
  }
}