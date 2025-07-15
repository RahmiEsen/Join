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
import { Highlight } from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import { Subscription } from 'rxjs';
import { TaskService } from '../../shared/services/task.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const CustomHighlight = Highlight.configure({ multicolor: true }).extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: element => element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes['color']) {
            return {};
          }
          // HIER DIE ÄNDERUNG: "color: inherit;" HINZUFÜGEN
          return {
            style: `background-color: ${attributes['color']}; color: inherit;`,
          };
        },
      },
    };
  },
});

interface ColorConfig { 
  base: string;
  hover: string;
}

interface CoverImage {
  name: string;
  dataUrl: string;
}

interface fontColorConfig {
  name: string;
  hex: string;
}

interface highlightColorConfig {
  name: string;
  hex: string;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

export class AddTaskComponent implements OnInit, AfterViewInit, OnDestroy  {
  @ViewChildren('toggleButton') toggleButtonRef!: QueryList<ElementRef>;
  @ViewChildren('coverMenuContainer') menuElementRef!: QueryList<ElementRef>;
  @ViewChildren('editorContainer') editorContainerRef!: QueryList<ElementRef>;
  @ViewChild('descriptionPreview') descriptionPreviewRef!: ElementRef<HTMLDivElement>;
  
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
  
  readonly colors: ColorConfig[] = [
    { base: '#4bce97', hover: '#7ee2b8' },
    { base: '#f5cd47', hover: '#e2b203' },
    { base: '#fea362', hover: '#fec195' },
    { base: '#f87168', hover: '#fd9891' },
    { base: '#9f8fef', hover: '#b8acf6' },
    { base: '#579dff', hover: '#85b8ff' },
    { base: '#6cc3e0', hover: '#9dd9ee' },
    { base: '#94c748', hover: '#b3df72' },
    { base: '#e774bb', hover: '#f797d2' },
    { base: '#8590a2', hover: '#b3b9c4' }
  ];
  
  readonly imageDisplayLimit = 6;
  readonly predefinedImages = [
    { url: 'assets/images/city.avif' },
    { url: 'assets/images/cloud.avif' },
    { url: 'assets/images/la.avif' },
    { url: 'assets/images/miami.avif' },
    { url: 'assets/images/stars.avif' },
    { url: 'assets/images/tokio.avif' }
  ];
  
  readonly designColors: fontColorConfig[] = [
    { name: 'Farbe 1', hex: '#ffffff' },
    { name: 'Farbe 2', hex: '#000000' },
    { name: 'Farbe 3', hex: '#e8e8e8' },
    { name: 'Farbe 4', hex: '#0e2841' },
    { name: 'Farbe 5', hex: '#156082' },
    { name: 'Farbe 6', hex: '#e97132' },
    { name: 'Farbe 7', hex: '#196b24' },
    { name: 'Farbe 8', hex: '#0f9ed5' },
    { name: 'Farbe 9', hex: '#a02b93' },
    { name: 'Farbe 10', hex: '#4ea72e' }
  ];
  
  readonly primaryColors: fontColorConfig[] = [
    { name: 'Farbe 1', hex: '#f2f2f2' },
    { name: 'Farbe 2', hex: '#7f7f7f' },
    { name: 'Farbe 3', hex: '#d0d0d0' },
    { name: 'Farbe 4', hex: '#dbe9f7' },
    { name: 'Farbe 5', hex: '#c1e4f5' },
    { name: 'Farbe 6', hex: '#fae2d6' },
    { name: 'Farbe 7', hex: '#c1f0c8' },
    { name: 'Farbe 8', hex: '#caedfb' },
    { name: 'Farbe 9', hex: '#f1ceee' },
    { name: 'Farbe 10', hex: '#d9f2d0' },
    { name: 'Farbe 11', hex: '#d8d8d8' },
    { name: 'Farbe 12', hex: '#595959' },
    { name: 'Farbe 13', hex: '#aeaeae' },
    { name: 'Farbe 14', hex: '#a6c9eb' },
    { name: 'Farbe 15', hex: '#83caeb' },
    { name: 'Farbe 16', hex: '#f6c6ac' },
    { name: 'Farbe 17', hex: '#84e291' },
    { name: 'Farbe 18', hex: '#95dcf7' },
    { name: 'Farbe 19', hex: '#e49edd' },
    { name: 'Farbe 20', hex: '#b3e5a1' },
    { name: 'Farbe 21', hex: '#bfbfbf' },
    { name: 'Farbe 22', hex: '#3f3f3f' },
    { name: 'Farbe 23', hex: '#747474' },
    { name: 'Farbe 24', hex: '#4d94d8' },
    { name: 'Farbe 25', hex: '#45b0e1' },
    { name: 'Farbe 26', hex: '#f1a984' },
    { name: 'Farbe 27', hex: '#47d45a' },
    { name: 'Farbe 28', hex: '#60cbf3' },
    { name: 'Farbe 29', hex: '#d76dcc' },
    { name: 'Farbe 30', hex: '#8ed873' },
    { name: 'Farbe 31', hex: '#a5a5a5' },
    { name: 'Farbe 32', hex: '#262626' },
    { name: 'Farbe 33', hex: '#3a3a3a' },
    { name: 'Farbe 34', hex: '#215e99' },
    { name: 'Farbe 35', hex: '#0f4861' },
    { name: 'Farbe 36', hex: '#bf4f14' },
    { name: 'Farbe 37', hex: '#12501b' },
    { name: 'Farbe 38', hex: '#0b769f' },
    { name: 'Farbe 39', hex: '#78206e' },
    { name: 'Farbe 40', hex: '#3a7d22' },
    { name: 'Farbe 41', hex: '#7f7f7f' },
    { name: 'Farbe 42', hex: '#0c0c0c' },
    { name: 'Farbe 43', hex: '#171717' },
    { name: 'Farbe 44', hex: '#153d64' },
    { name: 'Farbe 45', hex: '#0a3041' },
    { name: 'Farbe 46', hex: '#7f340d' },
    { name: 'Farbe 47', hex: '#0c3512' },
    { name: 'Farbe 48', hex: '#074f6a' },
    { name: 'Farbe 49', hex: '#501549' },
    { name: 'Farbe 50', hex: '#265316' },
  ];
  
  readonly standardColors: fontColorConfig[] = [
    { name: 'Farbe 1', hex: '#c00000' },
    { name: 'Farbe 2', hex: '#ee0000' },
    { name: 'Farbe 3', hex: '#ffc000' },
    { name: 'Farbe 4', hex: '#ffff00' },
    { name: 'Farbe 5', hex: '#92d050' },
    { name: 'Farbe 6', hex: '#00b050' },
    { name: 'Farbe 7', hex: '#00b0f0' },
    { name: 'Farbe 8', hex: '#0070c0' },
    { name: 'Farbe 9', hex: '#002060' },
    { name: 'Farbe 10', hex: '#7030a0' },
  ];
  
  readonly highlightColors: highlightColorConfig[] = [
    { name: 'Farbe 1', hex: '#ffff00' },
    { name: 'Farbe 2', hex: '#00ff00' },
    { name: 'Farbe 3', hex: '#00ffff' },
    { name: 'Farbe 4', hex: '#ff00ff' },
    { name: 'Farbe 5', hex: '#0000ff' },
    { name: 'Farbe 6', hex: '#ff0000' },
    { name: 'Farbe 7', hex: '#000080' },
    { name: 'Farbe 8', hex: '#008080' },
    { name: 'Farbe 9', hex: '#008000' },
    { name: 'Farbe 10', hex: '#800080' },
    { name: 'Farbe 11', hex: '#800000' },
    { name: 'Farbe 12', hex: '#808000' },
    { name: 'Farbe 13', hex: '#808080' },
    { name: 'Farbe 14', hex: '#c0c0c0' },
    { name: 'Farbe 15', hex: '#000000' },
  ];
  
  constructor(
    private cdr: ChangeDetectorRef,
    private taskService: TaskService,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.updateDisplayedImages();
    this.setInitialColor();
    /* this.detectUserContext(); */
  }
  
  ngAfterViewInit(): void {
    this.editorSubscription = this.editorContainerRef.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.first) {
        this.initializeEditor(list.first.nativeElement);
      }
    });
  }
  
/*   ngAfterViewChecked(): void {
  // Die Bedingung "!this.isDescriptionExpanded" wurde hier entfernt
  if (this.descriptionPreviewRef) {
    const element = this.descriptionPreviewRef.nativeElement;
    // Prüft, ob die tatsächliche Höhe größer ist als die sichtbare Höhe
    const isCurrentlyOverflowing = element.scrollHeight > element.clientHeight;

    // Nur aktualisieren, wenn sich der Zustand geändert hat
    if (isCurrentlyOverflowing !== this.isDescriptionOverflowing) {
      setTimeout(() => {
        this.isDescriptionOverflowing = isCurrentlyOverflowing;
        this.cdr.detectChanges();
      }, 0);
    }
  }
} */
  
  private initializeEditor(element: HTMLElement): void {
    if (this.editor) return;
    this.editor = new Editor({
      element,
      content: this.savedDescription || '',
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        Image.configure({
          allowBase64: true,
        }),
        CustomHighlight
      ],
      editorProps: {
        attributes: {
          class: 'ProseMirror',
          spellcheck: 'true'
        }
      },
      onFocus: () => {
        this.isEditorFocused = true;
        this.cdr.detectChanges();
      },
      onBlur: () => {
        this.isEditorFocused = false;
        this.cdr.detectChanges();
      }
    });
    this.editor.commands.focus();
    this.cdr.detectChanges();
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
    if (!this.isMenuOpen) return;
    if (this.toggleButtonRef?.first?.nativeElement.contains(event.target)) return;
    if (!this.menuElementRef?.first?.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
  
  @HostListener('document:click', ['$event.target'])
  onOutsideClick(target: HTMLElement): void {
    const clickedInside = target.closest('.dropdown-btn') || target.closest('.dropdown-content');
    if (!clickedInside) {
      this.isFontDropdownOpen = false;
      this.isFontHighlighterOpen = false;
      this.isupperLowerCaseOpen = false;
      this.isheadingDropdownOpen = false;
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
  
  setActiveEditorButton(buttonName: string): void {
    if (this.activeEditorButton === buttonName) {
      this.activeEditorButton = null;
    } else {
      this.activeEditorButton = buttonName;
    }
  }
  
  fontColorDropdown() {
    this.isFontDropdownOpen = !this.isFontDropdownOpen;
    if (this.isFontDropdownOpen) {
      this.isFontHighlighterOpen = false;
      this.isupperLowerCaseOpen = false;
      this.isheadingDropdownOpen = false;
    }
  }
  
  onFontColorSelect(color: string): void {
    if (this.selectedFontColorHex === color) {
      this.editor?.chain().focus().unsetColor().run();
      this.selectedFontColorHex = null;
    } else {
      this.editor?.chain().focus().setColor(color).run();
      this.selectedFontColorHex = color;
    }
    this.isFontDropdownOpen = false;
  }
  
  setInitialColor(): void {
    const defaultColor = this.designColors?.[1]?.hex;
    if (defaultColor) {
      this.selectedFontColorHex = defaultColor;
      this.editor?.chain().focus().setColor(defaultColor).run();
    }
  }
  
  fontHighlighterDropdown() {
    this.isFontHighlighterOpen = !this.isFontHighlighterOpen;
    if (this.isFontHighlighterOpen) {
      this.isFontDropdownOpen = false;
      this.isupperLowerCaseOpen = false;
      this.isheadingDropdownOpen = false;
    }
  }
  
  onFontHighlightSelect(color: string): void {
    this.selectedHighlightHex = color;
    this.editor?.chain().focus().setHighlight({ color }).run();
    this.isFontHighlighterOpen = false;
  }
  
  clearHighlight(): void {
    this.editor?.chain().focus().unsetHighlight().run();
    this.selectedHighlightHex = null;
  }
  
  upperLowerCaseDropwdown() {
    this.isupperLowerCaseOpen = !this.isupperLowerCaseOpen;
    if (this.isupperLowerCaseOpen) {
      this.isFontDropdownOpen = false;
      this.isFontHighlighterOpen = false;
      this.isheadingDropdownOpen = false;
    }
  }
  
  private replaceSelectedText(transformFn: (text: string) => string): void {
    const { state, view } = this.editor;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to, ' ');
    const transformedText = transformFn(selectedText);
    this.editor.chain().focus().insertContentAt({ from, to }, transformedText).run();
  }
  
  capitalizeSentence(): void {
    this.replaceSelectedText(text => 
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    );
    this.isupperLowerCaseOpen = false;
  }
  
  lowercase(): void {
    this.replaceSelectedText(text => text.toLowerCase());
    this.isupperLowerCaseOpen = false;
  }
  
  uppercase(): void {
    this.replaceSelectedText(text => text.toUpperCase());
    this.isupperLowerCaseOpen = false;
  }
  
  capitalizeEachWord(): void {
    this.replaceSelectedText(text =>
      text.replace(/\w\S*/g, word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
    );
    this.isupperLowerCaseOpen = false;
  }
  
  toggleCase(): void {
    this.replaceSelectedText(text =>
      [...text].map(char =>
        char === char.toUpperCase()
          ? char.toLowerCase()
          : char.toUpperCase()
      ).join('')
    );
    this.isupperLowerCaseOpen = false;
  }
  
  headingDropdown() {
    this.isheadingDropdownOpen = !this.isheadingDropdownOpen;
    if (this.isheadingDropdownOpen) {
      this.isFontDropdownOpen = false;
      this.isFontHighlighterOpen = false;
      this.isupperLowerCaseOpen = false;
    }
  }
  
  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6 | null): void {
    if (level === null) {
      this.editor?.chain().focus().setParagraph().run();
    } else {
      this.editor?.chain().focus().toggleHeading({ level }).run();
    }
    this.isheadingDropdownOpen = false;
  }
  
  onAttachmentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (file.type.startsWith('image/')) {
        this.editor?.chain().focus().setImage({ src: base64 }).run();
      } else {
        this.editor?.chain().focus().insertContent(
          `<a href="${base64}" download="${file.name}">${file.name}</a>`
        ).run();
      }
    };
    reader.readAsDataURL(file);
  }
  
  triggerFileUpload(): void {
    document.getElementById('editorFileUpload')?.click();
  }
  
  cancelDescription(): void {
    this.editorVisible = false;
    this.isEditorFocused = false;
    if (this.editor) {
      this.editor.destroy();
      this.editor = undefined!;
    }
  }
  
  saveDescription(): void {
    if (this.editor) {
      this.savedDescription = this.editor.getHTML();
      this.safeSavedDescription = this.sanitizer.bypassSecurityTrustHtml(this.savedDescription);
      this.isDescriptionExpanded = false;
      this.runOverflowCheckWhenReady();
      this.editorVisible = false;
      this.isEditorFocused = false;
      this.editor.destroy();
      this.editor = undefined!;
    }
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

  toggleDescriptionExpansion(event: MouseEvent): void {
    event.stopPropagation();
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


  /* private detectUserContext(): void {
    const user = this.authService.getUser();
    const isValidUser = user && user.id && user.id !== 'guest';
    this.loggedInUserId = isValidUser ? user.id : null;
    this.isGuestUser = !isValidUser;
  } */
}