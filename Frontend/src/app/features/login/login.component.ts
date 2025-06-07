import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  formFields = [
    {
      type: 'email',
      placeholder: 'Email',
      icon: 'mail.png',
      alt: 'Mail'
    },
    {
      type: 'password',
      placeholder: 'Password',
      icon: 'lock.png',
      alt: 'Password'
    }
  ];
  
  constructor(private router: Router) {}
  
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}