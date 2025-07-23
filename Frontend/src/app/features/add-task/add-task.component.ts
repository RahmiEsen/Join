import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  QueryList,
  ViewChildren,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { Subscription } from 'rxjs';
import { TaskService } from '../../shared/services/task.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { LabelSelectorComponent } from './label-selector/label-selector.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { ChecklistSelectorComponent } from './checklist-selector/checklist-selector.component';
import { CoverMenuComponent } from './task-header/cover-menu/cover-menu.component';
import { TaskHeaderComponent } from './task-header/task-header.component';
import { TaskDescriptionComponent } from './task-description/task-description.component';
import * as TaskModels from './add-task.models';
import { CustomHighlight, ColorConfig, CoverImage, LabelItem, } from './add-task.models';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    DropdownComponent,
    LabelSelectorComponent,
    DateSelectorComponent,
    ChecklistSelectorComponent,
    TaskHeaderComponent,
    CoverMenuComponent,
    TaskDescriptionComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class AddTaskComponent implements OnInit, OnDestroy  {
  @ViewChild(TaskHeaderComponent, { read: ElementRef }) taskHeaderElementRef!: ElementRef;
  @ViewChild(CoverMenuComponent, { read: ElementRef }) coverMenuElementRef!: ElementRef;
  @ViewChildren('editorContainer') editorContainerRef!: QueryList<ElementRef>;
  @ViewChild('descriptionPreview') descriptionPreviewRef!: ElementRef<HTMLDivElement>;
  @ViewChild('labelSelector') labelSelectorComponent!: LabelSelectorComponent;
  @ViewChild('dateDropdownRef') dateDropdownRef!: DropdownComponent;
  
  editor!: Editor;
  isMenuOpen = false;
  showAllImages = false;
  isImageLoading = false;
  selectedColor: ColorConfig | null = null;
  selectedCoverImageForHeader: string | null = null;
  selectedCoverImages: CoverImage[] = [];
  displayedCoverImages: CoverImage[] = [];
  activeEditorButton: string | null = null;
  editorVisible = false;
  isEditorFocused = false;
  private editorSubscription: Subscription | undefined;
  isFontDropdownOpen = false;
  selectedFontColorHex: string | null = null;
  isFontHighlighterOpen = false;
  selectedHighlightHex: string | null = null;
  isupperLowerCaseOpen = false;
  isheadingDropdownOpen = false;
  description: string = '';
  originalDescription: string = '';
  isEditingDescription: boolean = false;
  attachments: any[] = [];
  isGuestUser: boolean = true;
  loggedInUserId: string | null = null; 
  authService: any;
  savedDescription: string = '';
  safeSavedDescription: SafeHtml = '';
  isDescriptionOverflowing = false;
  isDescriptionExpanded = false;
  isLabelDropdownOpen = false;
  availableLabels = [
    { name: 'Feature', color: '#61bd4f' },
    { name: 'Bug', color: '#f2d600' },
    { name: 'Urgent', color: '#eb5a46' },
    { name: 'Idea', color: '#c377e0' },
  ];
  selectedLabels: string[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  
  readonly colors = TaskModels.coverColors;
  readonly imageDisplayLimit = TaskModels.imageDisplayLimit;
  readonly predefinedImages = TaskModels.predefinedImages;
  readonly designColors = TaskModels.designColors;
  readonly primaryColors = TaskModels.primaryColors;
  readonly standardColors = TaskModels.standardColors;
  readonly highlightColors = TaskModels.highlightColors;
  
  constructor(
    private cdr: ChangeDetectorRef,
    private taskService: TaskService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.updateDisplayedImages();
  }
  
  showEditor(): void {
    this.editorVisible = true;
  }
  
  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editorSubscription?.unsubscribe();
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isDropdownElement =
      target.closest('.dropdown-btn') ||
      target.closest('.dropdown-content') ||
      target.closest('.options-btn');
    const clickedInsideHeader = this.taskHeaderElementRef?.nativeElement.contains(target);
    const clickedInsideMenu = this.coverMenuElementRef?.nativeElement.contains(target);
    if (!clickedInsideHeader && !clickedInsideMenu) {
        this.closeMenu();
    }
    if (!isDropdownElement) {
      this.isFontDropdownOpen = false;
      this.isFontHighlighterOpen = false;
      this.isupperLowerCaseOpen = false;
      this.isheadingDropdownOpen = false;
      this.isLabelDropdownOpen = false;
    }
  }
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
  }
  
  selectColor(color: ColorConfig): void {
    this.selectedColor = this.selectedColor === color ? null : color;
    if (this.selectedColor) this.selectedCoverImageForHeader = null;
  }
  
  selectPredefinedImage(imageUrl: string): void {
    this.selectedCoverImageForHeader = this.selectedCoverImageForHeader === imageUrl ? null : imageUrl;
    if (this.selectedCoverImageForHeader) this.selectedColor = null;
  }
  
  selectCoverImage(image: CoverImage): void {
    this.selectedCoverImageForHeader = this.selectedCoverImageForHeader === image.dataUrl ? null : image.dataUrl;
    if (this.selectedCoverImageForHeader) this.selectedColor = null;
  }
  
  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    let loaded = 0;
    const checkDone = () => {
      if (++loaded === files.length) {
        this.isImageLoading = false;
        this.cdr.detectChanges();
      }
    };
    this.isImageLoading = true;
    files.forEach((file) => this.readImage(file, checkDone));
  }
  
  private readImage(file: File, onDone: () => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      const image: CoverImage = { name: file.name, dataUrl: reader.result as string };
      this.selectedCoverImages.push(image);
      this.selectedCoverImageForHeader = image.dataUrl;
      this.selectedColor = null;
      this.updateDisplayedImages();
      this.isImageLoading = false;
      this.cdr.detectChanges();
      onDone();
    };
    reader.readAsDataURL(file);
  }
  
  toggleImageDisplay(): void {
    this.showAllImages = !this.showAllImages;
    this.updateDisplayedImages();
  }
  
  private updateDisplayedImages(): void {
    this.displayedCoverImages = this.showAllImages
      ? [...this.selectedCoverImages]
      : this.selectedCoverImages.slice(0, this.imageDisplayLimit);
  }
  
  trackByColor = (_: number, color: ColorConfig) => color.base;
  
  cancelDescription(): void {
    this.editorVisible = false;
    this.isEditorFocused = false;
    if (this.editor) {
      this.editor.destroy();
      this.editor = undefined!;
    }
  }
  
  saveDescription(newContent: string): void {
    this.savedDescription = newContent;
    this.safeSavedDescription = this.sanitizer.bypassSecurityTrustHtml(this.savedDescription);
    this.isDescriptionExpanded = false;
    this.runOverflowCheckWhenReady();
    this.editorVisible = false;
  }
  
  submitTask(): void {
    const taskPayload = {
      description: this.editor?.getHTML() || '',
      coverColor: this.selectedColor?.base || null,
      coverImage: this.selectedCoverImageForHeader || null,
      attachments: this.attachments || [],
      isGuest: this.isGuestUser ?? true,
      ownerId: this.loggedInUserId ?? null
    };
    this.taskService.createTask(taskPayload).subscribe({
      next: (response) => {
        console.log('✅ Task gespeichert:', response);
      },
      error: (error) => {
        console.error('❌ Fehler beim Speichern:', error);
      }
    });
  }
  
  editDescription(): void {
    this.editorVisible = true;
  }
  
  toggleDescriptionExpansion(): void {
      this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
  
  private checkOverflow(): void {
    if (!this.descriptionPreviewRef) return;
    const element = this.descriptionPreviewRef.nativeElement;
    const isCurrentlyOverflowing = element.scrollHeight > element.clientHeight;
    
    if (isCurrentlyOverflowing !== this.isDescriptionOverflowing) {
      this.isDescriptionOverflowing = isCurrentlyOverflowing;
      this.cdr.detectChanges();
    }
  }
  
  private runOverflowCheckWhenReady(): void {
    setTimeout(() => {
      if (!this.descriptionPreviewRef) return;
      
      const images = Array.from(this.descriptionPreviewRef.nativeElement.querySelectorAll('img'));
      
      if (images.length === 0) {
        this.checkOverflow();
        return;
      }

      const promises = images.map(img => 
        new Promise(resolve => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = img.onerror = () => resolve(true);
          }
        })
      );

      Promise.all(promises).then(() => {
        this.checkOverflow();
      });
    }, 0); 
  }
  
  toggleLabelDropdown(): void {
    this.isLabelDropdownOpen = !this.isLabelDropdownOpen;
    console.log('isLabelDropdownOpen', this.isLabelDropdownOpen);
  }
  
  selectLabel(label: { name: string; color: string }): void {
    if (!this.selectedLabels.includes(label.name)) {
      this.selectedLabels.push(label.name);
    }
    this.isLabelDropdownOpen = false;
  }
  
  onLabelSelect(labelName: string): void {
    if (this.selectedLabels.includes(labelName)) {
      this.selectedLabels = this.selectedLabels.filter(l => l !== labelName);
    } else {
      this.selectedLabels.push(labelName);
    }
  }
  
  get labelTitle(): string {
    return this.labelSelectorComponent?.title || 'Labels';
  }
  
  public getLabelByName(name: string): LabelItem | undefined {
    if (!this.labelSelectorComponent) {
      return undefined;
    }
    return this.labelSelectorComponent.availableLabels.find(label => label.name === name);
  }
  
  onDatesReceived(dates: { startDate: Date | null; endDate: Date | null }) {
    this.selectedStartDate = dates.startDate;
    this.selectedEndDate = dates.endDate;
    this.dateDropdownRef?.close();
  }
  
  /* private detectUserContext(): void {
    const user = this.authService.getUser();
    const isValidUser = user && user.id && user.id !== 'guest';
    this.loggedInUserId = isValidUser ? user.id : null;
    this.isGuestUser = !isValidUser;
  } */
}