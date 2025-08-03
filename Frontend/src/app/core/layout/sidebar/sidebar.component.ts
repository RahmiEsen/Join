import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    this.item('Board', '/board', 'board'),
    this.item('Contacts', '/contacts', 'contacts')
  ];
  
  private item(label: string, route: string, icon: string) {
    return {
      label,
      route,
      icon: `${icon}.png`
    };
  }
}