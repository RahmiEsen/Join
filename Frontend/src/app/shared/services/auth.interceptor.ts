import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Hole den Token aus dem Local Storage
    const token = localStorage.getItem('access_token');

    // Wenn kein Token da ist, schicke die Anfrage unverändert weiter
    if (!token) {
      return next.handle(req);
    }

    // Wenn ein Token da ist, klone die Anfrage und füge den Header hinzu
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    // Schicke die neue Anfrage mit dem Header weiter
    return next.handle(authReq);
  }
}