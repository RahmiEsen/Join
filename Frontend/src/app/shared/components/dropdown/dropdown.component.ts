import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelSelectorComponent } from '../../../features/add-task/task-toolbar/label-selector/label-selector.component';

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
  @Input() showBackButton: boolean = false;
  @Input() headerTitle: string = '';
  @Output() backClicked = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @ViewChild('labelSelector') labelSelector?: LabelSelectorComponent;
  
  isOpen = false;
  
  constructor(private elementRef: ElementRef) {}
  
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.close();
    }
  }
  
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
  
  close(): void {
    this.closed.emit();
    this.isOpen = false;
  }
  
  goBackToList(event: MouseEvent): void {
    event.stopPropagation();
    this.backClicked.emit();
  }
}