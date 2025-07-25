import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() menuToggle = new EventEmitter<void>();
  @Input() selectedColor: ColorConfig | null = null;
  @Input() selectedCoverImageForHeader: string | null = null;
  
  toggleMenu(): void {
    this.menuToggle.emit();
  }
}