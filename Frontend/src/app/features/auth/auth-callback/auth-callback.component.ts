import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: ``,
  standalone: true,
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (
        !token ||
        typeof token !== 'string' ||
        token.split('.').length !== 3
      ) {
        console.error(
          'Ungültiger Token erhalten, Weiterleitung zum Login:',
          token
        );
        this.router.navigate(['/auth/login']);
        return;
      }
      try {
        this.authService.saveToken(token);
        const payload: any = jwtDecode(token);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('name', payload.name);
        localStorage.setItem(
          'isGuest',
          payload.role === 'guest' ? 'true' : 'false'
        );
        console.log('✅ Google Login erfolgreich, Weiterleitung zum Board...');
        this.router.navigate(['/board']);
      } catch (e) {
        console.error('Fehler beim Verarbeiten des Tokens:', e);
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
