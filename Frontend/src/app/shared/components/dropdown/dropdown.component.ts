import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelSelectorComponent } from '../../../features/add-task/task-toolbar/label-selector/label-selector.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class DropdownComponent {
  @Input() title: string = '';
  @Input() iconSrc: string = '';
  @Input() iconActiveSrc: string = '';
  @Input() showBackButton: boolean = false;
  @Input() headerTitle: string = '';
  @Input() customClass: string = '';
  @Output() backClicked = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @ViewChild('labelSelector') labelSelector?: LabelSelectorComponent;
  
  isOpen = false;
  
  /* constructor(private elementRef: ElementRef) {}
  
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.close();
    }
  } */
  
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