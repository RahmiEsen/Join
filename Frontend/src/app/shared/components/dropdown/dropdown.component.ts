import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})

export class DropdownComponent {
  @Input() title: string = '';
  @Input() iconSrc: string = '';
  @Input() iconActiveSrc: string = '';
  
  isOpen = false;
  
  constructor(private elementRef: ElementRef) {}
  
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }
  
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
  
  close(): void {
    this.isOpen = false;
  }
}