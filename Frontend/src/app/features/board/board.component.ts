import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskService, CreateTaskDto, TaskList, CreateTaskListDto } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/auth.service';
import { ContactService } from '../../shared/services/contact.service';
import { forkJoin } from 'rxjs';
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
  public taskLists: TaskList[] = [];
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
    this.loadLists();
    const user = this.authService.getUser();
    this.isGuestUser = !user || user.id === 'guest';
  }
  
  loadLists(): void {
    // Wir holen uns wieder beide Datenströme gleichzeitig
    const lists$ = this.taskService.getTaskLists();
    const contacts$ = this.contactService.getGuestContacts(); // Oder getContactsForUser, je nach Logik

    forkJoin({ lists: lists$, contacts: contacts$ }).subscribe(({ lists, contacts }) => {
      
      // Jetzt verarbeiten wir die Listen, die vom Backend kommen
      const processedLists = lists.map(list => {
        
        // Für jede Liste verarbeiten wir ihre Tasks
        const processedTasks = list.tasks.map(task => {
          
          // Und für jeden Task erstellen wir die 'assignedContacts'
          const assignedContacts = task.members?.map(member => {
            const foundContact = contacts.find(c => c.id === member.id);
            const fullName = `${member.firstName} ${member.lastName}`;
            
            return {
              id: member.id,
              name: fullName,
              color: foundContact?.color || '#808080', // Standardfarbe, falls Kontakt nicht gefunden
              initials: this.getInitials(fullName),
              // avatarUrl: foundContact?.avatarUrl // Falls du später Profilbilder hast
            };
          }) || []; // Leeres Array, falls keine Members vorhanden

          // Gib den Task mit den hinzugefügten assignedContacts zurück
          return { ...task, assignedContacts };
        });

        // Gib die Liste mit den verarbeiteten Tasks zurück
        return { ...list, tasks: processedTasks };
      });

      // Speichere das Endergebnis im State
      this.taskLists = processedLists;
    });
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  addTask(title: string, taskListId: string): void { 
    const taskPayload: CreateTaskDto = {
      title: title,
      taskListId: taskListId, // Backend erwartet 'taskListId'
      isGuest: this.isGuestUser,
    };
    this.taskService.createTask(taskPayload).subscribe({
      next: () => this.loadLists(), // Lade die Listen neu, um den neuen Task anzuzeigen
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
    this.loadLists();
  }
  
  toggleAddListForm(): void {
    this.isAddListFormVisible = !this.isAddListFormVisible;
    this.newListName = '';
  }
  
  addNewList(): void {
    const listName = this.newListName.trim();
    if (listName) {
      const listPayload: CreateTaskListDto = { title: listName };

      this.taskService.createTaskList(listPayload).subscribe({
        next: () => {
          this.loadLists(); // Lade alle Listen neu, um die neue anzuzeigen
          this.toggleAddListForm();
        },
        error: (err) => console.error('Fehler beim Erstellen der Liste:', err)
      });
    }
  }
  
  onListTitleChanged(event: { listId: string; newTitle: string }): void {
    this.taskService.updateTaskList(event.listId, event.newTitle).subscribe({
      next: (updatedList) => {
        // UI sofort aktualisieren, ohne neuladen zu müssen
        const listInComponent = this.taskLists.find(l => l.id === event.listId);
        if (listInComponent) {
          listInComponent.title = updatedList.title;
        }
      },
      error: (err) => console.error('Fehler beim Aktualisieren des Titels:', err),
    });
  }
}