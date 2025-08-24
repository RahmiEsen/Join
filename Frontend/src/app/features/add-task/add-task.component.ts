import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewChild,
  HostListener,
  OnInit,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Editor } from '@tiptap/core';
import { Subscription } from 'rxjs';
import { Task, CreateTaskDto, TaskService } from '../../shared/services/task.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';
import { CoverMenuComponent } from './task-header/cover-menu/cover-menu.component';
import { TaskHeaderComponent } from './task-header/task-header.component';
import { TaskDescriptionComponent } from './task-description/task-description.component';
import * as TaskModels from './add-task.models';
import { ColorConfig, CoverImage } from './add-task.models';
import { TaskToolbarComponent } from './task-toolbar/task-toolbar.component';
import { TaskSelectionsComponent } from './task-selections/task-selections.component';
import { TaskChecklistComponent } from './task-checklist/task-checklist.component';
import { Contact } from '../../shared/models/contact.model';
import { ContactService } from '../../shared/services/contact.service';
import { FormsModule } from '@angular/forms';
import { LabelService, Label, CreateLabelDto } from '../../shared/services/label.service';
import { AuthService } from '../../shared/services/auth.service';
import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    TaskToolbarComponent,
    TaskHeaderComponent,
    CoverMenuComponent,
    TaskDescriptionComponent,
    TaskSelectionsComponent,
    TaskChecklistComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))])
    ]),
  ]
})

export class AddTaskComponent implements OnInit, OnDestroy {
  @ViewChild(TaskHeaderComponent, { read: ElementRef }) taskHeaderElementRef!: ElementRef;
  @ViewChild(CoverMenuComponent, { read: ElementRef }) coverMenuElementRef!: ElementRef;
  @ViewChildren('editorContainer') editorContainerRef!: QueryList<ElementRef>;
  @ViewChild('descriptionPreview') descriptionPreviewRef!: ElementRef<HTMLDivElement>;
  @ViewChild('dateDropdownRef') dateDropdownRef!: DropdownComponent;
  @ViewChild(TaskToolbarComponent) private taskToolbar!: TaskToolbarComponent;
  @ViewChildren(TaskChecklistComponent) private checklistComponents!: QueryList<TaskChecklistComponent>;
  @Input() taskToEdit: Task | null = null;
  @Output() checklistDeleted = new EventEmitter<void>();
  @Output() taskSavedOrCancelled = new EventEmitter<void>();
  
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
  savedDescription: string = '';
  safeSavedDescription: SafeHtml = '';
  isDescriptionOverflowing = false;
  isDescriptionExpanded = false;
  isLabelDropdownOpen = false;
  selectedLabelIds: string[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  checklists: { title: string; items: { text: string; isCompleted: boolean }[] }[] = [];
  taskTitle: string = '';
  availableLabels: Label[] = [];
  loggedInUserId: string | null = null;
  isGuestUser: boolean = true;
  allContacts: Contact[] = []; 
  selectedMembers: Contact[] = [];
  private initialDataLoaded: Promise<void> | null = null;
  
  readonly colors = TaskModels.coverColors;
  readonly imageDisplayLimit = TaskModels.imageDisplayLimit;
  readonly predefinedImages = TaskModels.predefinedImages;
  readonly designColors = TaskModels.designColors;
  readonly primaryColors = TaskModels.primaryColors;
  readonly standardColors = TaskModels.standardColors;
  readonly highlightColors = TaskModels.highlightColors;
  readonly labelColors = TaskModels.labelColors;
  
  constructor(
    private cdr: ChangeDetectorRef,
    private taskService: TaskService,
    private sanitizer: DomSanitizer,
    private labelService: LabelService,
    private authService: AuthService,
    private contactService: ContactService
  ) {}
  
  ngOnInit(): void {
    this.updateDisplayedImages();
    const user = this.authService.getUser();
    this.isGuestUser = !user || user.id === 'guest';
    this.loggedInUserId = this.isGuestUser ? null : user?.id ?? null;
    this.initialDataLoaded = this.loadInitialData();
  }
  
  public async loadInitialData(): Promise<void> {
      const user = this.authService.getUser();
      this.isGuestUser = !user || user.id === 'guest';
      const userId = this.isGuestUser ? 'guest' : user?.id;

      if (!userId) {
          this.availableLabels = [];
          this.allContacts = [];
          return;
      }

      const [dbLabels, contacts] = await firstValueFrom(forkJoin([
          this.labelService.getLabelsForUser(userId),
          this.contactService.getUserContacts(userId) 
      ]));

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

      this.allContacts = contacts;

      if (this.taskToEdit) {
          this.populateFormWithTaskData(this.taskToEdit);
      }
      
      this.cdr.detectChanges();
  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> { 
    if (this.initialDataLoaded) {
      await this.initialDataLoaded;
    }
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.populateFormWithTaskData(this.taskToEdit);
    }
  }
  
  ngOnDestroy(): void {
    this.editor?.destroy();
    this.editorSubscription?.unsubscribe();
  }
  
  showEditor(): void {
    this.editorVisible = true;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = this.coverMenuElementRef?.nativeElement.contains(target);
    const clickedOnToggleButton = target.closest('.add-cover');
    if (clickedOnToggleButton) {
      return;
    }
    if (!clickedInsideMenu) {
      this.closeMenu();
    }
    const isDropdownElement =
      target.closest('.dropdown-btn') ||
      target.closest('.dropdown-content') ||
      target.closest('.options-btn');
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
    this.taskSavedOrCancelled.emit();
  }
  
  saveDescription(newContent: string): void {
    this.savedDescription = newContent;
    this.safeSavedDescription = this.sanitizer.bypassSecurityTrustHtml(this.savedDescription);
    this.isDescriptionExpanded = false;
    this.runOverflowCheckWhenReady();
    this.editorVisible = false;
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
    if (!this.selectedLabelIds.includes(label.name)) {
      this.selectedLabelIds.push(label.name);
    }
    this.isLabelDropdownOpen = false;
  }
  
  onLabelSelect(labelName: string): void {
    if (this.selectedLabelIds.includes(labelName)) {
      this.selectedLabelIds = this.selectedLabelIds.filter(l => l !== labelName);
    } else {
      this.selectedLabelIds.push(labelName);
    }
  }
  
  public onAvailableLabelsChange(labels: any[]): void {
    this.availableLabels = labels;
  }
  
  onDatesReceived(dates: { startDate: Date | null; endDate: Date | null }): void {
    this.selectedStartDate = dates.startDate;
    this.selectedEndDate = dates.endDate;
    this.cdr.detectChanges();
    this.dateDropdownRef?.close();
  }
  
  onDatesCleared(): void {
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dateDropdownRef?.close();
  }
  
  addChecklist(title: string): void {
    this.checklists.push({ title, items: [] });
  }
  
  public removeChecklist(index: number): void {
    this.checklists.splice(index, 1);
  }
  
  public onLabelSelectionClicked(): void {
    this.taskToolbar.openLabelDropdown();
  }
  
  public onDateSelectionClicked(): void {
    this.taskToolbar.openDateDropdown();
  }
  
  public onMemberSelectionClicked(): void {
    this.taskToolbar.openMemberDropdown();
  }
  
  async submitTask(): Promise<void> {
      const labelsToCreate = this.selectedLabelIds
          .map(id => this.availableLabels.find(label => label.id === id))
          .filter((label): label is Label => !!label && label.id.startsWith('default-'));
      if (labelsToCreate.length > 0) {
          console.log('Creating the following default labels in the DB:', labelsToCreate.map(l => l.title));
          const createLabelObservables = labelsToCreate.map(label => {
              const payload: CreateLabelDto = {
                  title: label.title,
                  color: label.color,
                  isGuest: this.isGuestUser,
                  ownerId: this.isGuestUser ? undefined : this.loggedInUserId!,
              };
              return this.labelService.createLabel(payload);
          });
          try {
              const newLabels = await firstValueFrom(forkJoin(createLabelObservables));
              const newLabelMap = new Map(newLabels.map(nl => [nl.title, nl.id]));
              const oldDefaultLabels = new Map(labelsToCreate.map(l => [l.id, l.title]));
              this.selectedLabelIds = this.selectedLabelIds.map(id => {
                  const oldTitle = oldDefaultLabels.get(id);
                  return oldTitle ? newLabelMap.get(oldTitle) || id : id;
              });
              const oldDefaultIds = labelsToCreate.map(l => l.id);
              this.availableLabels = [
                  ...this.availableLabels.filter(l => !oldDefaultIds.includes(l.id)),
                  ...newLabels
              ];
              console.log('Label lists updated successfully.');
          } catch (error) {
              console.error('❌ Error creating default labels:', error);
              return;
          }
      }
      const checklistPayload = this.checklistComponents.map(comp => ({
          title: comp.title,
          items: comp.tasks.map(task => ({
              text: task.text,
              isCompleted: task.checked
          }))
      }));
      const taskPayload: Partial<CreateTaskDto> = {
          title: this.taskTitle,
          description: this.savedDescription || '',
          isGuest: this.isGuestUser,
          coverColor: this.selectedColor?.base,
          coverImage: this.selectedCoverImageForHeader,
          startDate: this.selectedStartDate ? this.selectedStartDate.toISOString() : undefined,
          dueDate: this.selectedEndDate ? this.selectedEndDate.toISOString() : undefined,
          labelIds: this.selectedLabelIds,
          memberIds: this.selectedMembers.map(member => member.id),
          checklists: checklistPayload
      };
      if (this.taskToEdit) {
          console.log('Sending update payload to backend:', taskPayload);
          this.taskService.updateTask(this.taskToEdit.id, taskPayload).subscribe({
              next: (response) => {
                  console.log('✅ Task updated successfully:', response);
                  this.taskSavedOrCancelled.emit();
              },
              error: (error) => console.error('❌ Error updating task:', error)
          });
      } else {
          console.log('Sending create payload to backend:', taskPayload);
          this.taskService.createTask(taskPayload as CreateTaskDto).subscribe({
              next: (response) => {
                  console.log('✅ Task created successfully:', response);
                  this.taskSavedOrCancelled.emit();
              },
              error: (error) => console.error('❌ Error creating task:', error)
          });
      }
  }
  
  private populateFormWithTaskData(task: Task): void {
      this.taskTitle = task.title;
      this.savedDescription = task.description || '';
      this.safeSavedDescription = this.sanitizer.bypassSecurityTrustHtml(this.savedDescription);
      // CRITICAL FIX: Use the label's ID, not its title
      this.selectedLabelIds = task.labels ? task.labels.map(label => label.id) : [];
      this.selectedStartDate = task.startDate ? new Date(task.startDate) : null;
      this.selectedEndDate = task.dueDate ? new Date(task.dueDate) : null;
      this.selectedColor = task.coverColor ? { base: task.coverColor, hover: '' } : null;
      this.selectedCoverImageForHeader = task.coverImage || null;
      this.checklists = task.checklists || [];
      if (task.members && task.members.length > 0 && this.allContacts.length > 0) {
          this.selectedMembers = this.allContacts.filter(contact => 
              task.members!.some(member => member.id === contact.id)
          );
      } else {
          this.selectedMembers = [];
      }
      this.cdr.detectChanges();
  }
  
  deleteTask(): void {
    if (!this.taskToEdit || !this.taskToEdit.id) {
      console.error('Kein Task zum Löschen ausgewählt.');
      return;
    }
    const confirmation = confirm('Bist du sicher, dass du diesen Task endgültig löschen möchtest?');
    if (confirmation) {
      this.taskService.deleteTask(this.taskToEdit.id).subscribe({
        next: () => {
          console.log('✅ Task erfolgreich gelöscht');
          this.taskSavedOrCancelled.emit(); 
        },
        error: (err) => {
          console.error('❌ Fehler beim Löschen des Tasks:', err);
        }
      });
    }
  }
}