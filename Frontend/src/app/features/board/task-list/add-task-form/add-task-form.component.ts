import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task-form',
  standalone: true, // Moderne Angular-Komponenten sind standalone
  imports: [
    CommonModule, // Importieren, um ngIf, ngFor etc. zu nutzen
    FormsModule   // Importieren, um ngModel zu nutzen
  ],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss'
})

export class AddTaskFormComponent {
  isFormVisible: boolean = false;
  newTaskTitle: string = '';
  
  @Output() taskAdded = new EventEmitter<string>();
  @ViewChild('taskTitleInput') taskTitleInput?: ElementRef;
  
  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
    if (this.isFormVisible) {
      // Kurzer Timeout, damit das Element sicher im DOM ist, bevor wir fokussieren
      setTimeout(() => this.taskTitleInput?.nativeElement.focus(), 0);
    } else {
      this.newTaskTitle = '';
    }
  }
  
  emitAddTask(): void {
    const title = this.newTaskTitle.trim();
    if (title) {
      this.taskAdded.emit(title);
      this.newTaskTitle = '';
      this.isFormVisible = false;
    }
  }
}