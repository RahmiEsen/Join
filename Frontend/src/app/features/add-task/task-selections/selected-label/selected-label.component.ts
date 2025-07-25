import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LabelItem } from '../../add-task.models';

@Component({
  selector: 'app-selected-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-label.component.html',
  styleUrl: './selected-label.component.scss'
})

export class SelectedLabelComponent {
  @Input() selectedLabels: string[] = [];
  @Input() availableLabels: any[] = [];
  
  public getLabelByName(name: string): LabelItem | undefined {
    return this.availableLabels.find(label => label.name === name);
  }
}
