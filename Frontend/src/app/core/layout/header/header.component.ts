import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  showDropdown = false;
  userImageUrl: string | null = null;
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.userImageUrl = user?.picture ?? null;
  console.log('PB URL:', this.userImageUrl);
}
  
  get initials() {
    return this.authService.getUserInitials();
  }
  
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
  
  navigateTo(path: string): void {
    this.showDropdown = false;
    this.router.navigate([path]);
  }
}