import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { dropdownAnimation } from '../../../shared/animations/dropdown.animation';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  animations: [dropdownAnimation],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  showDropdown = false;
  constructor(
    private authService: AuthService, 
    private router: Router,
    private eRef: ElementRef
  ) {}
  
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
}
