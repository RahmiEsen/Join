import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskService, CreateTaskDto } from '../../shared/services/task.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { ContactService } from '../../shared/services/contact.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AddTaskComponent
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})

export class BoardComponent implements OnInit {
  tasks: Task[] = [];
  public activeTaskId: string | null = null;
  public showTaskInput: boolean = false;
  public newTaskTitle: string = '';
  private isGuestUser: boolean = true;
  public selectedTaskForEdit: Task | null = null; 
  public isModalVisible = false;
  
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private contactService: ContactService
  ) {}
  
  ngOnInit(): void {
    this.loadTasks();
    const user = this.authService.getUser();
    this.isGuestUser = !user || user.id === 'guest';
  }
  
  loadTasks(): void {
    const tasks$ = this.taskService.getGuestTasks();
    const contacts$ = this.contactService.getGuestContacts();
    forkJoin([tasks$, contacts$]).subscribe(([tasks, contacts]) => {
      const tasksWithAssignedContacts = tasks.map(task => {
        const assignedContacts = task.members
          ? task.members.map(member => {
              const foundContact = contacts.find(c => c.id === member.id);
              const fullName = `${member.firstName} ${member.lastName}`;
              return {
                id: member.id,
                name: fullName,
                color: foundContact?.color || '#808080',
                initials: this.getInitials(fullName),
              };
            })
          : [];
        return { ...task, assignedContacts };
      });
      this.tasks = tasksWithAssignedContacts;
    });
  }
  
  getInitials(name: string): string {
      if (!name) return '';
      const parts = name.trim().split(' ');
      return parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) {
      return; // Verhindert das Erstellen von leeren Tasks
    }

    const taskPayload: CreateTaskDto = {
      title: title,
      isGuest: this.isGuestUser,
    };

    this.taskService.createTask(taskPayload).subscribe({
      next: () => {
        this.loadTasks(); // Lädt die Tasks neu, um die Liste zu aktualisieren
        this.newTaskTitle = ''; // Setzt das Eingabefeld zurück
        this.showTaskInput = false; // Schließt das Eingabefeld
      },
      error: (error) => {
        console.error('Fehler beim Erstellen des Tasks:', error);
      },
    });
  }
  
  public formatDateRange(task: Task): string {
    const formattedStart = this.getFormattedDate(task.startDate);
    const formattedDue = this.getFormattedDate(task.dueDate);
    if (formattedStart && formattedDue) {
      return `${formattedStart} - ${formattedDue}`;
    }
    const singleDate = formattedDue || formattedStart;
    return singleDate ? singleDate : '';
  }
  
  private getFormattedDate(dateString?: string | null): string {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const year = date.getFullYear();
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(
      date
    );
    if (year === currentYear) {
      return `${day}.${month}`;
    } else {
      return `${day}.${month}. ${year}`;
    }
  }
  
  public getChecklistProgress(task: Task): string {
    if (!task.checklists || task.checklists.length === 0) {
      return '';
    }
    const totalItems = task.checklists.reduce(
      (sum, checklist) => sum + checklist.items.length,
      0
    );
    const completedItems = task.checklists.reduce(
      (sum, checklist) =>
        sum + checklist.items.filter((item) => item.isCompleted).length,
      0
    );
    return `${completedItems}/${totalItems}`;
  }
  
  public toggleTaskLabels(taskId: string): void {
    if (this.activeTaskId === taskId) {
      this.activeTaskId = null; // Bei erneutem Klick zuklappen
    } else {
      this.activeTaskId = taskId;
    }
  }
  
  public toggleTaskInput(): void {
    this.showTaskInput = !this.showTaskInput;
  }
  
  public openTaskForEdit(task: Task): void {
    this.selectedTaskForEdit = task;
    setTimeout(() => {
      this.isModalVisible = true;
    }, 10); 
  }
  
  public closeEditMode(): void {
    this.isModalVisible = false;
    setTimeout(() => {
      this.selectedTaskForEdit = null;
    }, 400); 
  }
  
  public onTaskSaved(): void {
    this.closeEditMode();
    this.loadTasks();
  }
}