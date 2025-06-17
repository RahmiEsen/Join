import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: ``,
})

export class AuthCallbackComponent implements OnInit {
  
  constructor(private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('accessToken', token);
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}