import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss'],
})

export class SuccessPopupComponent {
  @Input() visible = false;
  @Input() message = 'Action successful';
}