import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterModule } from '@angular/router';

interface Color {
  base: string;
  hover: string;
}

interface CoverImage {
  name: string;
  dataUrl: string;
}

@Component({
  selector: 'app-add-task',
  imports: [CommonModule, RouterModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class AddTaskComponent {
  isMenuOpen = false;
  selectedColor: Color | null = null;
  selectedCoverImage: string | null = null;
  selectedCoverImages: CoverImage[] = [];
  isImageLoading: boolean = false;
  selectedCoverImageForHeader: string | null = null;
  
  readonly colors: Color[] = [
    { base: '#4bce97', hover: '#7ee2b8' },
    { base: '#f5cd47', hover: '#e2b203' },
    { base: '#fea362', hover: '#fec195' },
    { base: '#f87168', hover: '#fd9891' },
    { base: '#9f8fef', hover: '#b8acf6' },
    { base: '#579dff', hover: '#85b8ff' },
    { base: '#6cc3e0', hover: '#9dd9ee' },
    { base: '#94c748', hover: '#b3df72' },
    { base: '#e774bb', hover: '#f797d2' },
    { base: '#8590a2', hover: '#b3b9c4' },
  ];
  
  readonly imageDisplayLimit = 6;
  displayedCoverImages: CoverImage[] = [];
  showAllImages = false;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.updateDisplayedImages();
  }
  
  @ViewChild('toggleButton') toggleButtonRef!: ElementRef;
  @ViewChild('coverMenuContainer') menuElementRef!: ElementRef;
  
  trackByColor(index: number, color: Color): string {
    return color.base;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen) {
      return;
    }
    const clickedOnToggleButton = this.toggleButtonRef?.nativeElement.contains(event.target);
    if (clickedOnToggleButton) {
      return;
    }
    const clickedInsideMenu = this.menuElementRef?.nativeElement.contains(event.target);
    if (!clickedInsideMenu) {
      this.closeMenu();
    }
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  selectColor(color: Color): void {
    if (this.selectedColor === color) {
      this.selectedColor = null;
    } else {
      this.selectedColor = color;
      this.selectedCoverImageForHeader = null;
    }
  }
  
  selectCoverImage(image: CoverImage) {
    if (this.selectedCoverImageForHeader === image.dataUrl) {
      this.selectedCoverImageForHeader = null;
    } else {
      this.selectedCoverImageForHeader = image.dataUrl;
      this.selectedColor = null;
    }
  }
  
  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.isImageLoading = true;
    const files = Array.from(input.files);
    let loaded = 0;
    const checkDone = () => {
      loaded++;
      if (loaded === files.length) {
        this.isImageLoading = false;
        this.cdr.detectChanges();
      }
    };
    files.forEach((file) => this.readImage(file, checkDone));
  }
  
  private readImage(file: File, onDone: () => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      const image: CoverImage = { name: file.name, dataUrl: reader.result as string };
      this.selectedCoverImages.push(image);
      this.selectedCoverImageForHeader = image.dataUrl;
      this.selectedColor = null;
      this.updateDisplayedImages(); 
      this.isImageLoading = false;
      this.cdr.detectChanges();
      onDone();
    };
    reader.readAsDataURL(file);
  }
  
  toggleImageDisplay(): void {
    this.showAllImages = !this.showAllImages;
    this.updateDisplayedImages();
  }
  
  private updateDisplayedImages(): void {
    if (this.showAllImages) {
      this.displayedCoverImages = [...this.selectedCoverImages];
    } else {
      this.displayedCoverImages = this.selectedCoverImages.slice(0, this.imageDisplayLimit);
    }
  }
  
  predefinedImages: { url: string; }[] = [
    { url: 'assets/images/city.avif' },
    { url: 'assets/images/cloud.avif' },
    { url: 'assets/images/la.avif' },
    { url: 'assets/images/miami.avif' },
    { url: 'assets/images/stars.avif' },
    { url: 'assets/images/tokio.avif' }
  ];
  
  selectPredefinedImage(imageUrl: string): void {
    if (this.selectedCoverImageForHeader === imageUrl) {
      this.selectedCoverImageForHeader = null;
    } else {
      this.selectedCoverImageForHeader = imageUrl;
      this.selectedColor = null;
    }
  }
}