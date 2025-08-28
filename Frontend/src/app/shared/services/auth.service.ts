import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient) {
    if (!this.currentUserSubject.getValue() && this.getToken()) {
      this.loadUserFromToken();
    }
  }
  
  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.saveToken(res.access_token);
      })
    );
  }
  
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.extractUserInfo(token);
  }
  
  private extractUserInfo(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        name: payload.name || '',
        role: payload.role || '',
        id: payload.sub || payload.id,
        picture: payload.picture || '',
        background: payload.background || '', 
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Token parsing failed:', e);
      this.currentUserSubject.next(null);
    }
  }
  
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      this.extractUserInfo(token);
    }
  }
  
  getUserPicture(): string | null {
    const currentUser = this.getUser();
    return currentUser ? (currentUser.picture ?? null) : null;
  }
  
  getUser() {
    return this.currentUserSubject.getValue();
  }
  
  getUserInitials(): string {
    const name = this.getUser()?.name;
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].length > 0 ? parts[0][0].toUpperCase() : '';
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
  
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
  
  updateUserBackground(backgroundValue: string): Observable<any> {
    const endpoint = `${environment.apiUrl}/user/me/background`; 
    return this.http.patch(endpoint, { background: backgroundValue }).pipe(
      tap(() => {
        const currentUser = this.getUser();
        const updatedUser = { ...currentUser, background: backgroundValue };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        console.log('Hintergrund erfolgreich aktualisiert und an Abonnenten gesendet!');
      })
    );
  }
  
  guestLogin(): Observable<any> {
    return this.http
      .post<{ access_token: string }>(
        `${this.apiUrl}/guest-login`,
        {}
      )
      .pipe(
        tap((res) => {
          this.saveToken(res.access_token);
          localStorage.setItem('isGuest', 'true');
        })
      );
  }
  
  private getUserFromLocalStorage(): any | null {
    if (typeof window !== 'undefined' && window.localStorage) {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
}