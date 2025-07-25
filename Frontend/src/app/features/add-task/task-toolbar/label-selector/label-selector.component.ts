import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { labelColors } from '../../add-task.models';

@Component({
  selector: 'app-label-selector',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    FormsModule,
  ],
  templateUrl: './label-selector.component.html',
  styleUrl: './label-selector.component.scss',
})

export class LabelSelectorComponent implements OnInit {
  @Input() selectedLabels: string[] = [];
  @Output() selectedLabelsChange = new EventEmitter<string[]>();
  @Output() editLabel = new EventEmitter<string>();
  @Output() availableLabelsChange = new EventEmitter<any[]>()
  
  viewMode: 'list' | 'edit' | 'create' = 'list';
  editLabelName?: string;
  selectedColor: string | null = null;
  editLabelTitle: string = '';
  editLabelIndex: number | null = null;
  
  availableLabels = [
    { name: 'Low', color: '#4bce97', hover: '#7ee2b8', isSystemLabel: true },
    { name: 'Medium', color: '#9f8fef', hover: '#b8acf6', isSystemLabel: true },
    { name: 'Urgent', color: '#c9372c', hover: '#ae2e24', isSystemLabel: true },
  ];
  
  readonly labelColors = labelColors;
  
  ngOnInit(): void {
    this.availableLabelsChange.emit(this.availableLabels);
  }
  
  toggleLabel(labelName: string): void {
    const isSelected = this.selectedLabels.includes(labelName);
    const updated = isSelected
      ? this.selectedLabels.filter(l => l !== labelName)
      : [...this.selectedLabels, labelName];
    this.selectedLabelsChange.emit(updated);
  }
  
  onEdit(labelName: string): void {
    const index = this.availableLabels.findIndex(l => l.name === labelName);
    if (index !== -1) {
      const label = this.availableLabels[index];
      this.editLabelIndex = index;
      this.editLabelTitle = label.name;
      this.selectedColor = label.color;
      this.viewMode = 'edit';
      const colorExists = this.labelColors.some(c => c.color === label.color);
      if (!colorExists) {
        this.labelColors.push({ color: label.color, hover: label.color });
      }
    }
  }
  
  exitEdit(): void {
    this.editLabelName = undefined;
    this.viewMode = 'list';
  }
  
  onCreate(): void {
    this.editLabelTitle = '';
    const randomIndex = Math.floor(Math.random() * this.labelColors.length);
    this.selectedColor = this.labelColors[randomIndex].color;
    this.viewMode = 'create';
  }
  
  selectColor(color: string): void {
    this.selectedColor = color;
  }
  
  get title(): string {
    switch (this.viewMode) {
      case 'edit':
        return 'Edit label';
      case 'create':
        return 'Create label';
      default:
        return 'Labels';
    }
  }
  
  removeColor(): void {
    this.selectedColor = '#e9ebee';
  }
  
  public getHoverColor(baseColor: string | null): string {
    if (!baseColor) {
      return '#e9ebee';
    }
    const colorConfig = this.labelColors.find(c => c.color === baseColor);
    return colorConfig ? colorConfig.hover : baseColor;
  }
  
  onSubmit(event: MouseEvent): void {
    event.stopPropagation();
    if (this.viewMode === 'edit') {
      this.saveLabel();
    } else {
      this.createLabel();
    }
  }
  
  resetForm(): void {
    this.editLabelIndex = null;
    this.editLabelTitle = '';
    this.selectedColor = '#e9ebee';
    this.viewMode = 'list';
  }
  
  createLabel(): void {
    const colorConfig = this.labelColors.find(c => c.color === this.selectedColor);
    const newLabel = {
      name: this.editLabelTitle.trim(),
      color: this.selectedColor || '#e9ebee',
      hover: colorConfig ? colorConfig.hover : this.selectedColor || '#e9ebee',
      isSystemLabel: false
    };
    const exists = this.availableLabels.some(
      l => l.name === newLabel.name && l.color === newLabel.color
    );
    if (!exists) {
      this.availableLabels.push(newLabel);
      this.availableLabelsChange.emit(this.availableLabels); // <-- ÄNDERUNG
    }
    this.resetForm();
  }
  
  saveLabel(): void {
    if (this.editLabelIndex === null) return;
    
    const colorConfig = this.labelColors.find(c => c.color === this.selectedColor);
    const oldName = this.availableLabels[this.editLabelIndex].name;
    const newName = this.editLabelTitle.trim();
    
    this.availableLabels[this.editLabelIndex] = {
      name: newName,
      color: this.selectedColor || '#e9ebee',
      hover: colorConfig ? colorConfig.hover : this.selectedColor || '#e9ebee',
      isSystemLabel: this.availableLabels[this.editLabelIndex].isSystemLabel
    };
    
    // ÄNDERUNG: Sende die aktualisierte Liste nach oben
    this.availableLabelsChange.emit(this.availableLabels);
    
    const selectedIndex = this.selectedLabels.indexOf(oldName);
    if (selectedIndex !== -1) {
      const updatedSelectedLabels = [...this.selectedLabels];
      updatedSelectedLabels[selectedIndex] = newName;
      this.selectedLabelsChange.emit(updatedSelectedLabels);
    }
    this.resetForm();
  }
  
  deleteLabel(event: MouseEvent): void {
    event.stopPropagation();
    if (this.editLabelIndex === null) return;
    
    const deletedLabelName = this.availableLabels[this.editLabelIndex].name;
    this.availableLabels.splice(this.editLabelIndex, 1);

    // ÄNDERUNG: Sende die aktualisierte Liste nach oben
    this.availableLabelsChange.emit(this.availableLabels);
    
    if (this.selectedLabels.includes(deletedLabelName)) {
      const updatedSelectedLabels = this.selectedLabels.filter(
        (name) => name !== deletedLabelName
      );
      this.selectedLabelsChange.emit(updatedSelectedLabels);
    }
    this.resetForm();
  }
}