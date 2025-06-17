import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Logging in with Google...</p>`,
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (!token || token.includes('Promise')) {
        console.error('❌ Ungültiger Token:', token);
        return;
      }

      localStorage.setItem('token', token);
      console.log('✅ Token gespeichert:', token);

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📦 Token Payload:', payload);

        // ✅ Weiterleitung nach erfolgreichem Login
        this.router.navigate(['/summary']);
      } catch (e) {
        console.error('❌ Fehler beim Decodieren:', e);
      }
    });
  }
}
