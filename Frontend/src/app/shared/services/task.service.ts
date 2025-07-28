import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Task {
  id: string;
  title: string;
  description?: any; // oder eine spezifischere Typ-Definition, falls bekannt
  isGuest: boolean;
  createdAt: string; // Datumswerte kommen als ISO-Strings vom Backend
  updatedAt: string;
  startDate?: string;
  dueDate?: string;
  // Hier können bei Bedarf auch die Relationen wie checklists, members etc. definiert werden
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
    private readonly apiUrl = 'http://localhost:3000/tasks';
    
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
    
    createTask(taskData: Partial<Task>): Observable<Task> {
        return this.http
        .post<Task>(this.apiUrl, taskData)
        .pipe(catchError(this.handleError));
    }
    
    updateTask(id: string, updates: Partial<Task>): Observable<Task> {
        return this.http
        .patch<Task>(`${this.apiUrl}/${id}`, updates)
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
}