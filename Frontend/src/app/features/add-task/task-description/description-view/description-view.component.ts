import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-description-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './description-view.component.html',
  styleUrls: ['./description-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DescriptionViewComponent {
  @Input() content: SafeHtml | null = null;
  @Input() isOverflowing: boolean = false;
  @Input() isExpanded: boolean = false;
  @Output() editRequest = new EventEmitter<void>();
  @Output() expansionToggle = new EventEmitter<void>();
  
  requestEdit(): void { this.editRequest.emit(); }
  
  toggleExpansion(event: MouseEvent): void {
    event.stopPropagation();
    this.expansionToggle.emit();
  }
}