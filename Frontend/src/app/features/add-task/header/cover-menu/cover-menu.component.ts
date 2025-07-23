import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ColorConfig, CoverImage } from '../../add-task.component';

@Component({
  selector: 'app-cover-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cover-menu.component.html',
  styleUrls: ['./cover-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class CoverMenuComponent {
  @Input() colors: ColorConfig[] = [];
  @Input() selectedColor: ColorConfig | null = null;
  @Input() selectedCoverImages: CoverImage[] = [];
  @Input() displayedCoverImages: CoverImage[] = [];
  @Input() selectedCoverImageForHeader: string | null = null;
  @Input() isImageLoading: boolean = false;
  @Input() imageDisplayLimit: number = 6;
  @Input() showAllImages: boolean = false;
  @Input() predefinedImages: { url: string }[] = [];

  // Outputs: Ereignisse, die an die Eltern-Komponente gesendet werden
  @Output() closeMenuRequest = new EventEmitter<void>();
  @Output() colorSelected = new EventEmitter<ColorConfig>();
  @Output() coverImageSelected = new EventEmitter<CoverImage>();
  @Output() imageUploaded = new EventEmitter<Event>();
  @Output() toggleDisplayRequest = new EventEmitter<void>();
  @Output() predefinedImageSelected = new EventEmitter<string>();

  // Methoden, die die Events auslösen
  onCloseMenu(): void {
    this.closeMenuRequest.emit();
  }

  onSelectColor(color: ColorConfig): void {
    this.colorSelected.emit(color);
  }

  onSelectCoverImage(image: CoverImage): void {
    this.coverImageSelected.emit(image);
  }

  onFileSelected(event: Event): void {
    this.imageUploaded.emit(event);
  }

  onToggleImageDisplay(): void {
    this.toggleDisplayRequest.emit();
  }

  onSelectPredefinedImage(url: string): void {
    this.predefinedImageSelected.emit(url);
  }

  trackByColor = (_: number, color: ColorConfig) => color.base;
}