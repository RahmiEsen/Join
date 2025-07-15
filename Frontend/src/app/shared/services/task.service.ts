import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private apiUrl = 'http://localhost:3000/tasks';

    constructor(private http: HttpClient) {}

    createTask(task: any): Observable<any> {
        return this.http.post(this.apiUrl, task);
    }

    getTasksForUser(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}?userId=${userId}`);
    }

    getGuestTasks(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
}