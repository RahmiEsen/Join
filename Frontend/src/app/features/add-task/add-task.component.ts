import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

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
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class AddTaskComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainerRef!: ElementRef;
  @ViewChild('toggleButton') toggleButtonRef!: ElementRef;
  @ViewChild('coverMenuContainer') menuElementRef!: ElementRef;
  
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
    { base: '#8590a2', hover: '#b3b9c4' }
  ];
  
  readonly imageDisplayLimit = 6;
  readonly predefinedImages = [
    { url: 'assets/images/city.avif' },
    { url: 'assets/images/cloud.avif' },
    { url: 'assets/images/la.avif' },
    { url: 'assets/images/miami.avif' },
    { url: 'assets/images/stars.avif' },
    { url: 'assets/images/tokio.avif' }
  ];
  
  editor!: Editor;
  isMenuOpen = false;
  showAllImages = false;
  isImageLoading = false;
  selectedColor: Color | null = null;
  selectedCoverImageForHeader: string | null = null;
  selectedCoverImages: CoverImage[] = [];
  displayedCoverImages: CoverImage[] = [];
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.updateDisplayedImages();
    this.editor = new Editor({ extensions: [StarterKit], content: '' });
  }
  
  ngAfterViewInit(): void {
    const el = this.editorContainerRef?.nativeElement;
    if (el && this.editor) {
      const dom = this.editor.view.dom;
      dom.setAttribute('contenteditable', 'true');
      dom.classList.add('ProseMirror');
      dom.style.minHeight = '150px';
      dom.style.outline = 'none';
      el.appendChild(dom);
    }
  }
  
  ngOnDestroy(): void {
    this.editor?.destroy();
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen) return;
    if (this.toggleButtonRef?.nativeElement.contains(event.target)) return;
    if (!this.menuElementRef?.nativeElement.contains(event.target)) this.closeMenu();
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  selectColor(color: Color): void {
    this.selectedColor = this.selectedColor === color ? null : color;
    if (this.selectedColor) this.selectedCoverImageForHeader = null;
  }
  
  selectPredefinedImage(imageUrl: string): void {
    this.selectedCoverImageForHeader = this.selectedCoverImageForHeader === imageUrl ? null : imageUrl;
    if (this.selectedCoverImageForHeader) this.selectedColor = null;
  }
  
  selectCoverImage(image: CoverImage): void {
    this.selectedCoverImageForHeader = this.selectedCoverImageForHeader === image.dataUrl ? null : image.dataUrl;
    if (this.selectedCoverImageForHeader) this.selectedColor = null;
  }
  
  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    let loaded = 0;
    const checkDone = () => {
      if (++loaded === files.length) {
        this.isImageLoading = false;
        this.cdr.detectChanges();
      }
    };
    this.isImageLoading = true;
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
    this.displayedCoverImages = this.showAllImages
      ? [...this.selectedCoverImages]
      : this.selectedCoverImages.slice(0, this.imageDisplayLimit);
  }
  
  trackByColor = (_: number, color: Color) => color.base;
}