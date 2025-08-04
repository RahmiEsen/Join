import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskService, CreateTaskDto } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/auth.service';
import { ContactService } from '../../shared/services/contact.service';
import { forkJoin } from 'rxjs';

// Komponenten-Imports
import { AddTaskComponent } from '../add-task/add-task.component';
import { BackgroundComponent } from '../background/background.component';
import { TaskListComponent } from './task-list/task-list.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddTaskComponent,
    BackgroundComponent,
    TaskListComponent,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})

export class BoardComponent implements OnInit {
  public taskLists: { title: string, status: string, tasks: Task[] }[] = [
    { title: 'To Do', status: 'todo', tasks: [] },
    { title: 'In Progress', status: 'inProgress', tasks: [] },
    { title: 'Awaiting Feedback', status: 'awaitingFeedback', tasks: [] },
    { title: 'Done', status: 'done', tasks: [] },
  ];
  public selectedTaskForEdit: Task | null = null; 
  public isModalVisible = false;
  private isGuestUser: boolean = true;
  public isAddListFormVisible: boolean = false;
  public newListName: string = '';
  
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
    forkJoin({ tasks: tasks$, contacts: contacts$ }).subscribe(({ tasks, contacts }) => {
      const allTasks = tasks.map(task => ({
        ...task,
        assignedContacts: task.members?.map(member => {
          const foundContact = contacts.find(c => c.id === member.id);
          const fullName = `${member.firstName} ${member.lastName}`;
          return {
            id: member.id,
            name: fullName,
            color: foundContact?.color || '#808080',
            initials: this.getInitials(fullName),
          };
        }) || []
      }));
      this.taskLists.forEach(list => {
        list.tasks = allTasks.filter(task => (task.status || 'todo') === list.status);
      });
    });
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  addTask(title: string, status: string): void {
    const taskPayload: CreateTaskDto = {
      title: title,
      status: status,
      isGuest: this.isGuestUser,
    };
    this.taskService.createTask(taskPayload).subscribe({
      next: () => this.loadTasks(),
      error: (error) => console.error('Fehler beim Erstellen des Tasks:', error),
    });
  }
  
  openTaskForEdit(task: Task): void {
    this.selectedTaskForEdit = task;
    setTimeout(() => { this.isModalVisible = true; }, 10); 
  }
  
  closeEditMode(): void {
    this.isModalVisible = false;
    setTimeout(() => { this.selectedTaskForEdit = null; }, 400); 
  }
  
  onTaskSaved(): void {
    this.closeEditMode();
    this.loadTasks();
  }
  
  toggleAddListForm(): void {
    this.isAddListFormVisible = !this.isAddListFormVisible;
    this.newListName = '';
  }
  
  addNewList(): void {
    const listName = this.newListName.trim();
    if (listName) {
      this.taskLists.push({
        title: listName,
        status: this.generateStatusId(listName), 
        tasks: []
      });
      this.toggleAddListForm();
    }
  }
  
  private generateStatusId(name: string): string {
    return name.replace(/\s+/g, '-').toLowerCase();
  }
}