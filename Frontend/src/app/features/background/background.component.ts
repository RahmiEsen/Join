import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

interface BackgroundOption {
  label: string;
  styleClass: string;
  view: 'pictures' | 'colors';
}

interface ColorOption {
  emoji: string;
  background: string; 
}

interface ImageOption {
  url: string;
}

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
  animations: [
    trigger('openClose', [
      state('closed', style({ width: '52px', height: '40px', opacity: 1 })),
      state('openMain', style({ width: '354px', height: '193px', opacity: 1 })),
      state('openSub', style({ width: '354px', height: '368px', opacity: 1 })),
      transition('* => *', [ animate('300ms ease-in-out') ]),
    ]),
    trigger('fadeInContent', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms 150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class BackgroundComponent implements OnInit, OnDestroy {
  backgroundOptions: BackgroundOption[] = [
    { label: 'Pictures', styleClass: 'option-card--pictures', view: 'pictures' },
    { label: 'Colors', styleClass: 'option-card--colors', view: 'colors' }
  ];
  isMenuOpen = false;
  currentView: 'main' | 'pictures' | 'colors' = 'main';
  colorOptions: ColorOption[] = [
    { emoji: '🏜️', background: 'linear-gradient(140deg, #f7d488, #f0a26e, #c97b6a)' },
    { emoji: '🌿', background: 'linear-gradient(140deg, #1e6b54, #2ab78f, #a2e4b8)' },
    { emoji: '🐠', background: 'linear-gradient(140deg, #36d1dc, #5b86e5, #ff9a9e)' },
    { emoji: '🌇', background: 'linear-gradient(140deg, #ffc371, #ff8c42, #e55d87)' },
    { emoji: '🌋', background: 'linear-gradient(140deg, #ff4e00, #a02d00, #2c1a1a)' },
    { emoji: '✨', background: 'linear-gradient(140deg, #141e30, #243b55, #3a506b)' },
    { emoji: '🌸', background: 'linear-gradient(140deg, #a8e063, #d9e7a8, #f4b6c2)' },
    { emoji: '🌲', background: 'linear-gradient(140deg, #566573, #85929e, #a9b7c0)' },
    { emoji: '👾', background: 'linear-gradient(135deg, #ff00cc, #333399, #f97e2f)' },
    { emoji: '☕️', background: 'linear-gradient(135deg, #3e2723, #d9c8b9, #a0d2a3)' }, 
    { emoji: '🌃', background: 'linear-gradient(135deg, #0d0221, #0c356a, #279eff, #d900ff)' },
    { emoji: '🍑', background: 'linear-gradient(135deg, #fee9e1, #fddfd8, #f8c9b8)' },
    { emoji: '🍵', background: 'linear-gradient(135deg, #e4e3e3, #d1e2c4, #8aa292)' },
    { emoji: '💎', background: 'linear-gradient(135deg, #00467f, #a5cc82, #f9f871)' }, 
    { emoji: '💿', background: 'linear-gradient(135deg, #e0e0e0, #a2facf, #f0a2fa)' }, 
    { emoji: '🍬', background: 'linear-gradient(135deg, #00c9ff, #92fe9d, #f800b7)' },
  ];
  imageOptions: ImageOption[] = [
    { url: '/assets/backgrounds/bg-1.png' },
    { url: '/assets/backgrounds/bg-2.jpg' },
    { url: '/assets/backgrounds/bg-4.jpg' },
    { url: '/assets/backgrounds/bg-5.png' },
    { url: '/assets/backgrounds/bg-6.jpg' },
    { url: '/assets/backgrounds/bg-7.png' },
    { url: '/assets/backgrounds/bg-8.png' },
    { url: '/assets/backgrounds/bg-9.jpg' },
    { url: '/assets/backgrounds/bg-10.jpg' },
    { url: '/assets/backgrounds/bg-11.png' },
    { url: '/assets/backgrounds/bg-12.jpg' },
    { url: '/assets/backgrounds/bg-13.png' },
    { url: '/assets/backgrounds/bg-14.jpg' },
    { url: '/assets/backgrounds/bg-15.png' },
    { url: '/assets/backgrounds/bg-16.jpg' },
    { url: '/assets/backgrounds/bg-17.jpg' },
  ];
  
  currentBackground: string | null = null;
  private userSubscription!: Subscription;
  
  constructor(
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  
  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentBackground = user?.background;
    });
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.currentView = 'main';
    }
  }
  
  selectBackground(backgroundValue: string): void {
    this.document.body.style.background = backgroundValue;
    this.authService.updateUserBackground(backgroundValue).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Fehler beim Speichern des Hintergrunds:', err);
      }
    });
  }
  
  get menuState(): 'closed' | 'openMain' | 'openSub' {
    if (!this.isMenuOpen) { return 'closed'; }
    return this.currentView === 'main' ? 'openMain' : 'openSub';
  }
  
  setView(view: 'main' | 'pictures' | 'colors'): void {
    this.currentView = view;
  }
}