// src/app/add-task/header/task-header.component.ts

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorConfig } from '../add-task.component'; // Importiere das Interface

@Component({
  selector: 'app-task-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskHeaderComponent {
  // Inputs von der Eltern-Komponente
  @Input() selectedColor: ColorConfig | null = null;
  @Input() selectedCoverImageForHeader: string | null = null;

  // Outputs an die Eltern-Komponente
  @Output() toggleMenuRequest = new EventEmitter<void>();
  @Output() closeTaskRequest = new EventEmitter<void>(); // Für den Schließen-Button

  onToggleMenu(): void {
    this.toggleMenuRequest.emit();
  }

  // Optional: Wenn der Schließen-Button die ganze Aufgabe schließen soll
  onCloseTask(): void {
    this.closeTaskRequest.emit();
  }
}