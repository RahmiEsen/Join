import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})

export class MainLayoutComponent  implements OnInit  {
  currentUser$!: Observable<any>;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }

  getBackgroundStyles(backgroundValue: string | null): { [key: string]: any } {
    if (!backgroundValue) {
      return {};
    }
    const isImageOrGradient = backgroundValue.includes('url(') || backgroundValue.includes('gradient');
    if (isImageOrGradient) {
      return {
        'background-image': backgroundValue,
        'background-color': 'transparent' 
      };
    } else {
      return {
        'background-color': backgroundValue,
        'background-image': 'none'
      };
    }
  }
}