import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Label {
  id: string;
  title: string;
  color: string;
  ownerId?: string | null;
  isGuest?: boolean;
}

export interface CreateLabelDto {
  title: string;
  color: string;
  ownerId?: string;
  isGuest?: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class LabelService {
  private apiUrl = 'http://localhost:3000/labels';
  
  constructor(private http: HttpClient) {}
  
  getLabelsForUser(userId: string): Observable<Label[]> {
    const endpoint = userId === 'guest' ? `${this.apiUrl}/guest` : `${this.apiUrl}/user/${userId}`;
    return this.http.get<Label[]>(endpoint);
  }
  
  createLabel(labelData: CreateLabelDto): Observable<Label> {
    return this.http
      .post<Label>(this.apiUrl, labelData)
      .pipe(catchError(this.handleError));
  }
  
  updateLabel(id: string, updates: Partial<CreateLabelDto>): Observable<Label> {
    return this.http
      .patch<Label>(`${this.apiUrl}/${id}`, updates)
      .pipe(catchError(this.handleError));
  }
  
  deleteLabel(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }
  
  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}