import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent /* implements OnInit */ {
  title = 'join';
  /* constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applyBackground();

    // 👇 Jedes Mal bei Navigation erneut setzen
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.applyBackground();
      });
  }

  applyBackground(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      const background = user?.background;
      if (background) {
        this.document.body.setAttribute(
          'style',
          `background: ${background} !important;
           background-size: cover;
           background-repeat: no-repeat;
           background-position: center;`
        );
      }
    } catch (e) {
      console.error('Fehler beim Parsen des Users:', e);
    }
  } */
}