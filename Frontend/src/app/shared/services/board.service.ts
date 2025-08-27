import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskList } from './task.service';

@Injectable({
  providedIn: 'root'
})

export class BoardService {
  private apiUrl = 'https://join-orpin.vercel.app/tasklists';
  
  constructor(private http: HttpClient) { }
  
  getTaskListsForUser(userId: string): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.apiUrl}/user/${userId}`);
  }
  
  getGuestTaskLists(): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.apiUrl}/guest`);
  }
  
  updateTaskListOrder(orderedIds: string[]): Observable<any> {
    const body = { orderedIds };
    return this.http.patch(`${this.apiUrl}/order`, body);
  }
}