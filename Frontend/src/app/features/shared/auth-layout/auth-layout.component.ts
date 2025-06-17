import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})

export class AuthLayoutComponent {
  @Input() showSignupLink = false;
  @Input() showFooter = true;
  constructor(private router: Router) {}
  
  goToSignup() {
    this.router.navigate(['./auth/signup']);
  }
}