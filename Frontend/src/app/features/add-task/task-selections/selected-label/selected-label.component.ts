import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LabelItem } from '../../add-task.models';
import { Label } from '../../../../shared/services/label.service';

@Component({
  selector: 'app-selected-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-label.component.html',
  styleUrl: './selected-label.component.scss'
})

export class SelectedLabelComponent {
  @Input() selectedLabels: string[] = [];
  @Input() availableLabels: Label[] = [];
  showAllLabels = false;
  
  public getLabelById(id: string): Label | undefined {
    return this.availableLabels.find(label => label.id === id);
  }
  
  toggleShowAll() {
    this.showAllLabels = !this.showAllLabels;
  }
}