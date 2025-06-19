import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  constructor(private router: Router) {}
  
  navItems = [
    { label: 'Summary', route: '/summary', icon: 'summary.png', iconActive: 'summary-active.png' },
    { label: 'Add Task', route: '/add-task', icon: 'add-task.png', iconActive: 'add-task-active.png' },
    { label: 'Board', route: '/board', icon: 'board.png', iconActive: 'board-active.png' },
    { label: 'Contacts', route: '/contacts', icon: 'contacts.png', iconActive: 'contacts-active.png' }
  ];
  
  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
