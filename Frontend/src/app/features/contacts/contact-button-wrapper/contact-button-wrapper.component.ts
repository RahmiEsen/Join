import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contact-button-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-button-wrapper.component.html',
  styleUrls: ['./contact-button-wrapper.component.scss']
})

export class ContactButtonWrapperComponent {
  @Input() isEditMode: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
}