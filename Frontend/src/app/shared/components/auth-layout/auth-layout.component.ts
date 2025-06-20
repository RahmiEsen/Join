import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})

export class AuthLayoutComponent implements OnInit {
  @Input() showSignupLink = false;
  @Input() showFooter = true;
  @ViewChild('logoEl') logoEl!: ElementRef;
  
  showIntroAnimation = false;
  showLoginLogo = false;
  logoSrc = 'assets/images/logo-dark.png';
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    const isLoginPage = this.router.url.includes('/auth/login');
    this.showIntroAnimation = isLoginPage;

    if (isLoginPage) {
      setTimeout(() => {
        this.showIntroAnimation = false;
        this.showLoginLogo = true;
      }, 1400);
    } else {
      this.showLoginLogo = true;
    }
  }
  
  ngAfterViewInit(): void {
    if (!this.showIntroAnimation) return;
    setTimeout(() => {
      const isMobile = window.innerWidth <= 1024;
      const el = this.logoEl?.nativeElement;
      if (!el) return;
      this.logoSrc = isMobile
        ? 'assets/images/logo.png'
        : 'assets/images/logo-dark.png';
      gsap.set(el, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: isMobile ? 100 : 274,
        height: isMobile ? 120 : 334,
        zIndex: 2,
      });
      gsap.to(el, {
        top: isMobile ? '20px' : '80px',
        left: isMobile ? '38px' : '77px',
        width: isMobile ? 64 : 100,
        height: isMobile ? 78 : 120,
        xPercent: 0,
        yPercent: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      setTimeout(() => {
        this.logoSrc = 'assets/images/logo-dark.png';
      }, 550);
    }, 0);
  }
  
  goToSignup() {
    this.router.navigate(['./auth/signup']);
  }
}