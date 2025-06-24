import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-slide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-slide.component.html',
  styleUrl: './success-slide.component.scss'
})
export class SuccessSlideComponent implements OnChanges {
  @Input() message = '';
  @Input() visible = false;
  slideOut = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue === true) {
      this.slideOut = false;
      setTimeout(() => {
        this.slideOut = true;
      }, 2600);
    }
  }
}