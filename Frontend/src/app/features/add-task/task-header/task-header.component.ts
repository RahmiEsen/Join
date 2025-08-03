
import { 
  Component, 
  ChangeDetectionStrategy, 
  Input, 
  Output, 
  EventEmitter, 
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorConfig } from '../add-task.models';

@Component({
  selector: 'app-task-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskHeaderComponent implements OnChanges {
  @Output() menuToggle = new EventEmitter<void>();
  @Output() closeRequest = new EventEmitter<void>();
  @Input() selectedColor: ColorConfig | null = null;
  @Input() selectedCoverImageForHeader: string | null = null;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedColor'] || changes['selectedCoverImageForHeader']) {
      this.cdr.detectChanges();
    }
  }
  
  toggleMenu(): void {
    this.menuToggle.emit();
  }
  
  onCloseClick(): void {
    this.closeRequest.emit();
  }
}