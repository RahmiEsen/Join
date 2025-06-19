import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-auth-callback',
  template: ``,
})

export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
        console.error('Ungültiger Token:', token);
        return;
      }
      try {
        const payload: any = jwtDecode(token);
        console.log('Token Payload:', payload);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(payload));

        this.router.navigate(['/summary']);
      } catch (e) {
        console.error('Fehler beim Decodieren:', e);
      }
    });
  }
}
