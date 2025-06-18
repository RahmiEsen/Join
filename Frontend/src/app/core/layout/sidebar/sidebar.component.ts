import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  navItems = [
    {
      label: 'Summary',
      route: '/summary',
      icon: 'summary.png',
      iconHover: 'summary-hover.png'
    },
    {
      label: 'Add Task',
      route: '/add-task',
      icon: 'add-task.png',
      iconHover: 'add-task-hover.png'
    },
    {
      label: 'Board',
      route: '/board',
      icon: 'board.png',
      iconHover: 'board-hover.png'
    },
    {
      label: 'Contacts',
      route: '/contacts',
      icon: 'contacts.png',
      iconHover: 'contacts-hover.png'
    }
  ];
  hoveredItem: string | null = null;
}