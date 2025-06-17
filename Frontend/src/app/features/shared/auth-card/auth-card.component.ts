import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.scss']
})

export class AuthCardComponent {
  @Input() title = '';
  @Input() secondTitle = '';
  @Input() showLineBreak = true;
  @Input() showBack = false;
  constructor(private router: Router) {}
  
  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}