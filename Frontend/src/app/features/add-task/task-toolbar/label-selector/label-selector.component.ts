import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgSwitch, NgSwitchCase, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { labelColors } from '../../add-task.models';
import { LabelService, Label, CreateLabelDto } from '../../../../shared/services/label.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { finalize } from 'rxjs';

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
  @Input() availableLabels: Label[] = [];
  @Output() selectedLabelsChange = new EventEmitter<string[]>();

  viewMode: 'list' | 'edit' | 'create' = 'list';
  editLabelData: Label | null = null;
  selectedColor: string | null = null;
  editLabelTitle: string = '';
  loggedInUserId: string | null = null;
  isGuestUser: boolean = false;

  readonly labelColors = labelColors;

  constructor(
    private labelService: LabelService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.isGuestUser = !user || user.id === 'guest';
    this.loggedInUserId = this.isGuestUser ? null : user?.id ?? null;

    this.loadLabels();
  }

  loadLabels(): void {
    const userId = this.isGuestUser ? 'guest' : this.loggedInUserId;
    if (!userId) {
      this.availableLabels = [];
      return;
    }
    this.labelService.getLabelsForUser(userId).subscribe(dbLabels => {
      const defaultLabels: Label[] = [
          { id: 'default-1', title: 'Low', color: '#4bce97' },
          { id: 'default-2', title: 'Medium', color: '#9f8fef' },
          { id: 'default-3', title: 'Urgent', color: '#c9372c' },
      ];
      const combinedLabels = [...dbLabels];
      defaultLabels.forEach(defaultLabel => {
          const exists = dbLabels.some(dbLabel => dbLabel.title.toLowerCase() === defaultLabel.title.toLowerCase());
          if (!exists) {
              combinedLabels.push(defaultLabel);
          }
      });
      this.availableLabels = combinedLabels.sort((a, b) => a.title.localeCompare(b.title));
    });
  }

  toggleLabel(labelTitle: string): void {
    const isSelected = this.selectedLabels.includes(labelTitle);
    const updated = isSelected
      ? this.selectedLabels.filter(l => l !== labelTitle)
      : [...this.selectedLabels, labelTitle];
    this.selectedLabelsChange.emit(updated);
  }

  onEdit(label: Label): void {
    this.editLabelData = label;
    this.editLabelTitle = label.title;
    this.selectedColor = label.color;
    this.viewMode = 'edit';
  }

  exitEdit(): void {
    this.resetForm();
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
    this.selectedColor = null;
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
    this.editLabelData = null;
    this.editLabelTitle = '';
    this.selectedColor = null;
    this.viewMode = 'list';
  }

  createLabel(): void {
    if (!this.editLabelTitle || !this.selectedColor) return;

    const payload: CreateLabelDto = {
      title: this.editLabelTitle.trim(),
      color: this.selectedColor,
      ...(this.isGuestUser
        ? { isGuest: true }
        : { ownerId: this.loggedInUserId! })
    };

    this.labelService.createLabel(payload).subscribe(() => {
      this.loadLabels();
      this.resetForm(); // Nach dem Neuladen der Daten die Ansicht zurücksetzen
    });
  }

  saveLabel(): void {
    if (!this.editLabelData || !this.editLabelTitle || !this.selectedColor) return;

    // Wenn ein "default"-Label bearbeitet wird, ist das ein "create"-Vorgang.
    if (this.editLabelData.id.startsWith('default-')) {
      this.createLabel();
      return;
    }

    // Andernfalls ist es ein "update"-Vorgang.
    const updates: Partial<CreateLabelDto> = {
      title: this.editLabelTitle.trim(),
      color: this.selectedColor,
    };

    this.labelService.updateLabel(this.editLabelData.id, updates).subscribe(() => {
      // Prüfen, ob das bearbeitete Label in der aktuellen Auswahl war
      if (this.selectedLabels.includes(this.editLabelData!.title)) {
        const updatedSelection = this.selectedLabels.map(l =>
          l === this.editLabelData!.title ? updates.title! : l
        );
        this.selectedLabelsChange.emit(updatedSelection);
      }
      this.loadLabels();
      this.resetForm(); // Nach dem Neuladen der Daten die Ansicht zurücksetzen
    });
  }

  deleteLabel(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.editLabelData) return;

    // "Default"-Labels, die noch nicht gespeichert sind, nur lokal entfernen.
    if (this.editLabelData.id.startsWith('default-')) {
      this.availableLabels = this.availableLabels.filter(l => l.id !== this.editLabelData!.id);
      this.resetForm();
      return;
    }

    // Echte Labels vom Server löschen.
    this.labelService.deleteLabel(this.editLabelData.id).subscribe(() => {
      const deletedLabelName = this.editLabelData!.title;
      // Prüfen, ob das gelöschte Label in der aktuellen Auswahl war
      if (this.selectedLabels.includes(deletedLabelName)) {
        const updatedSelection = this.selectedLabels.filter(name => name !== deletedLabelName);
        this.selectedLabelsChange.emit(updatedSelection);
      }
      this.loadLabels();
      this.resetForm(); // Nach dem Neuladen der Daten die Ansicht zurücksetzen
    });
  }
}