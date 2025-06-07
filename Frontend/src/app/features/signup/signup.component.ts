import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  formFields = [
    {
      type: 'text',
      placeholder: 'Name',
      icon: 'person.png',
      alt: 'Person'
    },
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
    },
    {
      type: 'password',
      placeholder: 'Confirm Password',
      icon: 'lock.png',
      alt: 'Confirm Password'
    }
  ];
}
