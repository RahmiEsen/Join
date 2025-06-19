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
    this.extractUserInfo(token);
  }
  
  private user: {
    name: string;
    role: string;
    picture?: string;
    id?: string;
  } = { name: '', role: '' };
  
  private extractUserInfo(token: string): void {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.user = {
      name: payload.name || '',
      role: payload.role || '',
      id: payload.sub || payload.id,
      picture: payload.picture || '', // ✅ Bild wird übernommen
    };

    localStorage.setItem('user', JSON.stringify(this.user)); // ✅ für globale Nutzung
  } catch (e) {
    console.error('Token parsing failed:', e);
    this.user = { name: '', role: '' };
  }
}


getUserPicture(): string | null {
  return this.getUser().picture ?? null;
}

  
  getUser() {
    if (!this.user.name && this.getToken()) {
      this.extractUserInfo(this.getToken()!);
    }
    return this.user;
  }
  
  getUserInitials(): string {
    const name = this.getUser().name;
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  logout(): void {
    localStorage.clear();
    this.user = { name: '', role: '' };
  }
  
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
  
  guestLogin() {
    return this.http
      .post<{ access_token: string, user: { id: string, role: string } }>(
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
}