import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown.component';
import { LabelSelectorComponent } from './label-selector/label-selector.component';
import { CommonModule } from '@angular/common';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { ChecklistSelectorComponent } from './checklist-selector/checklist-selector.component';

@Component({
  selector: 'app-task-toolbar',
  imports: [
    CommonModule,
    DropdownComponent,
    LabelSelectorComponent,
    DateSelectorComponent,
    ChecklistSelectorComponent,
  ],
  templateUrl: './task-toolbar.component.html',
  styleUrl: './task-toolbar.component.scss'
})

export class TaskToolbarComponent {
  @Input() selectedLabels: string[] = [];
  @Output() selectedLabelsChange = new EventEmitter<string[]>();
  @Output() dateSelected = new EventEmitter<{ startDate: Date | null; endDate: Date | null }>();
  @Output() availableLabelsChange = new EventEmitter<any[]>();
  @ViewChild('labelSelector') labelSelector?: LabelSelectorComponent;
  
  labelTitle = 'Labels';
}