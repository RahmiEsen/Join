import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';


export interface LabelItem {
  name: string;
  color: string;
}

export interface ColorConfig { 
  color: string;
  hover: string;
}

interface Label {
  name: string;
  color: string;
  isSystemLabel: boolean;
}

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

export class LabelSelectorComponent {
  @Input() selectedLabels: string[] = [];
  @Output() selectedLabelsChange = new EventEmitter<string[]>();
  @Output() editLabel = new EventEmitter<string>();
  
  viewMode: 'list' | 'edit' | 'create' = 'list';
  editLabelName?: string;
  selectedColor: string | null = null;
  editLabelTitle: string = '';
  editLabelIndex: number | null = null;
  
  availableLabels = [
    { name: 'Low', color: '#4bce97', isSystemLabel: true },
    { name: 'Medium', color: '#9f8fef', isSystemLabel: true },
    { name: 'Urgent', color: '#c9372c', isSystemLabel: true },
  ];
  
  readonly labelColors: ColorConfig[] = [
    {  color: '#baf3db', hover: '#7ee2b8' },
    {  color: '#f8e6a0', hover: '#f5cd47' },
    {  color: '#fedec8', hover: '#fec195' },
    {  color: '#ffd5d2', hover: '#fd9891' },
    {  color: '#dfd8fd', hover: '#b8acf6' },
    {  color: '#4bce97', hover: '#7ee2b8' },
    {  color: '#f5cd47', hover: '#e2b203' },
    {  color: '#fea362', hover: '#fec195' },
    {  color: '#f87168', hover: '#fd9891' },
    {  color: '#9f8fef', hover: '#b8acf6' },
    {  color: '#1f845a', hover: '#216e4e' },
    {  color: '#946f00', hover: '#7f5f01' },
    {  color: '#c25100', hover: '#a54800' },
    {  color: '#c9372c', hover: '#ae2e24' },
    {  color: '#6e5dc6', hover: '#5e4db2' },
    {  color: '#cce0ff', hover: '#85b8ff' },
    {  color: '#c6edfb', hover: '#9dd9ee' },
    {  color: '#d3f1a7', hover: '#b3df72' },
    {  color: '#fdd0ec', hover: '#f797d2' },
    {  color: '#dcdfe4', hover: '#b3b9c4' },
    {  color: '#579dff', hover: '#85b8ff' },
    {  color: '#6cc3e0', hover: '#9dd9ee' },
    {  color: '#94c748', hover: '#b3df72' },
    {  color: '#e774bb', hover: '#f797d2' },
    {  color: '#8590a2', hover: '#b3b9c4' },
    {  color: '#0c66e4', hover: '#0055cc' },
    {  color: '#227d9b', hover: '#206a83' },
    {  color: '#5b7f24', hover: '#4c6b1f' },
    {  color: '#ae4787', hover: '#943d73' },
    {  color: '#626f86', hover: '#44546f' }
  ];
  
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
    const newLabel = {
      name: this.editLabelTitle.trim(),
      color: this.selectedColor || '#e9ebee',
      isSystemLabel: false // 🔥 das musst du ergänzen!
    };
    const exists = this.availableLabels.some(
      l => l.name === newLabel.name && l.color === newLabel.color
    );
    if (!exists) {
      this.availableLabels.push(newLabel);
    }
    this.resetForm();
  }
  
  saveLabel(): void {
    if (this.editLabelIndex === null) return;
    const oldName = this.availableLabels[this.editLabelIndex].name;
    const newName = this.editLabelTitle.trim();
    this.availableLabels[this.editLabelIndex] = {
      name: newName,
      color: this.selectedColor || '#e9ebee',
      isSystemLabel: this.availableLabels[this.editLabelIndex].isSystemLabel
    };
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
    if (this.selectedLabels.includes(deletedLabelName)) {
      const updatedSelectedLabels = this.selectedLabels.filter(
        (name) => name !== deletedLabelName
      );
      this.selectedLabelsChange.emit(updatedSelectedLabels);
    }
    this.resetForm();
  }
}