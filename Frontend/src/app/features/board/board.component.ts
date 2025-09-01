import { Component, OnInit, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskService, CreateTaskDto, TaskList, CreateTaskListDto } from '../../shared/services/task.service';
import { AuthService } from '../../shared/services/auth.service';
import { ContactService } from '../../shared/services/contact.service';
import { forkJoin, Observable } from 'rxjs';
import { AddTaskComponent } from '../add-task/add-task.component';
import { BackgroundComponent } from '../background/background.component';
import { TaskListComponent } from './task-list/task-list.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem  } from '@angular/cdk/drag-drop';
import { BoardService } from '../../shared/services/board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddTaskComponent,
    BackgroundComponent,
    TaskListComponent,
    DragDropModule,
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
  public openListMenuId: string | null = null;
  public isDragDisabled = window.innerWidth <= 768;
  public isLoading = true;
  
  
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private contactService: ContactService,
    private boardService: BoardService
  ) {}
  
  ngOnInit(): void {
    this.loadLists();
    const user = this.authService.getUser();
    this.isGuestUser = !user || user.id === 'guest';
  }
  
  loadLists(): void {
    this.isLoading = true;
    const user = this.authService.getUser();
    const isGuest = !user || user.id === 'guest';
    let lists$: Observable<TaskList[]>;
    if (isGuest) {
      lists$ = this.boardService.getGuestTaskLists();
    } else {
      lists$ = this.boardService.getTaskListsForUser(user.id);
    }
    const contacts$ = isGuest 
      ? this.contactService.getGuestContacts() 
      : this.contactService.getUserContacts(user.id);
    forkJoin({ lists: lists$, contacts: contacts$ }).subscribe({
      next: ({ lists, contacts }) => {
        const processedLists = lists.map(list => {
          const processedTasks = list.tasks.map(task => {
            const assignedContacts = task.members?.map(member => {
              const foundContact = contacts.find(c => c.id === member.id);
              const fullName = `${member.firstName} ${member.lastName}`;
              return {
                id: member.id,
                name: fullName,
                color: foundContact?.color || '#808080',
                initials: this.getInitials(fullName),
              };
            }) || [];
            return { ...task, assignedContacts };
          });
          return { ...list, tasks: processedTasks };
        });
        this.taskLists = processedLists;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Board-Daten:', err);
        this.isLoading = false;
      }
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
      taskListId: taskListId,
      isGuest: this.isGuestUser,
    };
    this.taskService.createTask(taskPayload).subscribe({
      next: () => this.loadLists(),
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
      const user = this.authService.getUser();
      const isGuest = !user || user.id === 'guest';
      const listPayload: CreateTaskListDto = {
        title: listName,
      };
      if (isGuest) {
        listPayload.isGuest = true;
      } else {
        listPayload.ownerId = user.id;
      }
      this.taskService.createTaskList(listPayload).subscribe({
        next: () => {
          this.loadLists();
          this.toggleAddListForm();
        },
        error: (err) => console.error('Fehler beim Erstellen der Liste:', err)
      });
    }
  }
  
  onListTitleChanged(event: { listId: string; newTitle: string }): void {
    this.taskService.updateTaskList(event.listId, event.newTitle).subscribe({
      next: (updatedList) => {
        const listInComponent = this.taskLists.find(l => l.id === event.listId);
        if (listInComponent) {
          listInComponent.title = updatedList.title;
        }
      },
      error: (err) => console.error('Fehler beim Aktualisieren des Titels:', err),
    });
  }
  
  toggleListMenu(listId: string): void {
    if (listId) {
      this.openListMenuId = this.openListMenuId === listId ? null : listId;
    } else {
      this.openListMenuId = null;
    }
  }
  
  onDeleteList(listId: string): void {
    this.taskService.deleteTaskList(listId).subscribe({
      next: () => {
        this.taskLists = this.taskLists.filter(list => list.id !== listId);
        console.log(`List with ID ${listId} deleted successfully.`);
      },
      error: (err) => {
        console.error('Failed to delete the list:', err);
      }
    });
  }
  
  dropList(event: CdkDragDrop<TaskList[]>) {
    moveItemInArray(this.taskLists, event.previousIndex, event.currentIndex);
    const orderedIds = this.taskLists.map(list => list.id);
    this.boardService.updateTaskListOrder(orderedIds).subscribe({
      next: () => {
        console.log('Reihenfolge der Listen erfolgreich im Backend gespeichert.');
      },
      error: (err) => {
        console.error('Fehler beim Speichern der neuen Reihenfolge:', err);
      }
    });
  }
  
  dropTask(event: CdkDragDrop<Task[]>) {
    const movedTask = event.item.data;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    const newListId = event.container.id; 
    const newOrder = event.currentIndex; 
    const updatePayload = {
      taskListId: newListId,
      order: newOrder
    };
    this.taskService.updateTask(movedTask.id, updatePayload).subscribe({
      next: () => console.log(`Task-Position erfolgreich gespeichert!`),
      error: (err) => console.error('Fehler beim Speichern der Task-Position:', err)
    });
  }
  
  getAllListIds(): string[] {
    return this.taskLists.map(list => list.id);
  }
  
  handleMoveList(event: { listId: string; newPosition: number }): void {
    const originalIndex = this.taskLists.findIndex(list => list.id === event.listId);
    moveItemInArray(this.taskLists, originalIndex, event.newPosition);
    const orderedIds = this.taskLists.map(list => list.id);
    this.boardService.updateTaskListOrder(orderedIds).subscribe({
      next: () => {
        console.log('Reihenfolge der Listen erfolgreich durch Menü-Aktion gespeichert.');
      },
      error: (err) => {
        console.error('Fehler beim Speichern der neuen Reihenfolge:', err);
      }
    });
  }
  
  handleMoveTask(event: { taskId: string; targetListId: string; newPosition: number }): void {
    let sourceList: TaskList | undefined;
    let taskToMove: Task | undefined;
    let originalIndex = -1;

    // Finde die Aufgabe und ihre ursprüngliche Liste
    for (const list of this.taskLists) {
      const taskIndex = list.tasks.findIndex(t => t.id === event.taskId);
      if (taskIndex !== -1) {
        sourceList = list;
        taskToMove = list.tasks[taskIndex];
        originalIndex = taskIndex;
        break;
      }
    }

    if (!sourceList || !taskToMove) {
      console.error('Task oder Quell-Liste nicht gefunden!');
      return;
    }

    // Entferne die Aufgabe aus der alten Liste
    sourceList.tasks.splice(originalIndex, 1);

    // Finde die neue Liste und füge die Aufgabe an der neuen Position hinzu
    const targetList = this.taskLists.find(list => list.id === event.targetListId);
    if (targetList) {
      targetList.tasks.splice(event.newPosition, 0, taskToMove);
    } else {
      console.error('Ziel-Liste nicht gefunden!');
      return;
    }
    
    // Backend-Update anstoßen (ähnlich wie bei Drag & Drop)
    const updatePayload = {
      taskListId: event.targetListId,
      order: event.newPosition
    };
    this.taskService.updateTask(taskToMove.id, updatePayload).subscribe({
      next: () => console.log(`Task-Position erfolgreich via Menü gespeichert!`),
      error: (err) => console.error('Fehler beim Speichern der Task-Position:', err)
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isDragDisabled = (event.target as Window).innerWidth <= 768;
  }
}