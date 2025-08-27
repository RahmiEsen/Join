import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Task {
    id: string;
    title: string;
    description?: string;
    isGuest: boolean;
    coverColor?: string | null;
    coverImage?: string | null;
    createdAt: string;
    updatedAt: string;
    startDate?: string | null;
    dueDate?: string | null;
    labelIds?: string[];
    labels?: { id: string; title: string; color: string }[];
    members?: { id: string; firstName: string; lastName: string }[];
    assignedContacts?: { id: string; name: string; color: string; initials: string; avatarUrl?: string }[];
    checklists?: { id: string; title: string; items: { id: string; text: string; isCompleted: boolean }[] }[];
    status?: string;
}

export interface CreateChecklistItemDto {
  text: string;
  isCompleted?: boolean;
}

export interface CreateChecklistDto {
  title: string;
  items: CreateChecklistItemDto[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  isGuest?: boolean;
  coverColor?: string | null;
  coverImage?: string | null;
  startDate?: string;
  dueDate?: string;
  labelIds?: string[];
  memberIds?: string[];
  checklists?: CreateChecklistDto[];
  taskListId: string
}

export interface TaskList {
  id: string;
  title: string;
  createdAt: string;
  tasks: Task[];
}

export interface CreateTaskListDto {
  title: string;
  ownerId?: string;
  isGuest?: boolean;
}

@Injectable({
    providedIn: 'root',
})

export class TaskService {
    private readonly apiUrl = 'https://join-backend-flix.vercel.app/tasks';
    private readonly listsApiUrl = 'https://join-backend-flix.vercel.app/tasklists';
    
    constructor(private http: HttpClient) {}
    
    getGuestTasks(): Observable<Task[]> {
        return this.http
        .get<Task[]>(`${this.apiUrl}/guest`)
        .pipe(catchError(this.handleError));
    }
    
    getTasksForUser(userId: string): Observable<Task[]> {
        return this.http
        .get<Task[]>(`${this.apiUrl}/user/${userId}`)
        .pipe(catchError(this.handleError));
    }
    
    createTask(taskData: CreateTaskDto): Observable<Task> {
        return this.http
        .post<Task>(this.apiUrl, taskData)
        .pipe(catchError(this.handleError));
    }
    
    createTaskList(listData: CreateTaskListDto): Observable<TaskList> {
        return this.http
        .post<TaskList>(this.listsApiUrl, listData)
        .pipe(catchError(this.handleError));
    }
    
    deleteTask(id: string): Observable<{ message: string }> {
        return this.http
        .delete<{ message: string }>(`${this.apiUrl}/${id}`)
        .pipe(catchError(this.handleError));
    }
    
    private handleError(error: HttpErrorResponse) {
        
        console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
        );
        return throwError(
        () => new Error('Something bad happened; please try again later.')
        );
    }
    
    updateTask(id: string, taskData: Partial<CreateTaskDto>): Observable<Task> {
        return this.http.patch<Task>(`${this.apiUrl}/${id}`, taskData);
    }
    
    updateTaskList(id: string, newTitle: string): Observable<TaskList> {
        const url = `${this.listsApiUrl}/${id}`;
        const body = { title: newTitle };
        return this.http.patch<TaskList>(url, body).pipe(catchError(this.handleError));
    }
    
    deleteTaskList(listId: string): Observable<any> {
        return this.http.delete(`${this.listsApiUrl}/${listId}`);
    }
}