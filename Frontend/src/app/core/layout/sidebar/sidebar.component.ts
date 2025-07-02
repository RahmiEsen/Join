import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent implements OnInit {
  navItems: any[] = [];
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.updateNavItems();
  }
  
  @HostListener('window:resize')
  onResize(): void {
    this.updateNavItems();
  }
  
  private updateNavItems(): void {
    const mobile = window.innerWidth <= 1024;
    const base = [
      this.item('Summary', '/summary', 'summary'),
      this.item('Add Task', '/add-task', 'add-task'),
      this.item('Board', '/board', 'board'),
      this.item('Contacts', '/contacts', 'contacts')
    ];
    if (mobile) [base[1], base[2]] = [base[2], base[1]];
    this.navItems = base;
  }
  
  private item(label: string, route: string, icon: string) {
    return {
      label,
      route,
      icon: `${icon}.png`,
      iconActive: `${icon}-active.png`
    };
  }
  
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}