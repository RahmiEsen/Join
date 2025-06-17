import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  
  constructor(private http: HttpClient) {}
  
  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.saveToken(res.access_token);
      })
    );
  }
  
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  logout(): void {
    localStorage.removeItem('access_token');
  }
  
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
  
  guestLogin() {
    return this.http.post<{ access_token: string, user: { id: string, role: string } }>(
      'http://localhost:3000/auth/guest-login',
      {}
    );
  }
}
