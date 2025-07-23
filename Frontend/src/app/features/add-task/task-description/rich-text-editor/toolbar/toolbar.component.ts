import { Component, ChangeDetectionStrategy, Input, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';
import { designColors, primaryColors, standardColors, highlightColors } from '../../../add-task.models';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})

export class ToolbarComponent {
  @Input() editor!: Editor;
  @ViewChild('toolbarWrapper', { static: true }) toolbarWrapper!: ElementRef;
  
  isheadingDropdownOpen = false;
  isupperLowerCaseOpen = false;
  isFontDropdownOpen = false;
  isFontHighlighterOpen = false;
  selectedFontColorHex: string | null = null;
  selectedHighlightHex: string | null = null;
  
  readonly designColors = designColors;
  readonly primaryColors = primaryColors;
  readonly standardColors = standardColors;
  readonly highlightColors = highlightColors;
  
  constructor(private elementRef: ElementRef) {}
  
  headingDropdown() {
    this.isheadingDropdownOpen = !this.isheadingDropdownOpen;
    if (this.isheadingDropdownOpen) {
      this.isFontDropdownOpen = false;
      this.isFontHighlighterOpen = false;
      this.isupperLowerCaseOpen = false;
    }
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    const isDropdownTrigger =
      target.closest('.dropdown-btn') ||
      target.closest('.dropdown-content') ||
      target.closest('.color-option') ||
      target.closest('.highlight-row') ||
      target.closest('.deselect-wrapper');
    if (!clickedInside || !isDropdownTrigger) {
      this.closeAllDropdowns();
    }
  }
  
  private closeAllDropdowns(): void {
    this.isheadingDropdownOpen = false;
    this.isupperLowerCaseOpen = false;
    this.isFontDropdownOpen = false;
    this.isFontHighlighterOpen = false;
  }
  
  upperLowerCaseDropwdown() {
    this.isupperLowerCaseOpen = !this.isupperLowerCaseOpen;
    if (this.isupperLowerCaseOpen) {
      this.isFontDropdownOpen = false;
      this.isFontHighlighterOpen = false;
      this.isheadingDropdownOpen = false;
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
  
  fontHighlighterDropdown() {
    this.isFontHighlighterOpen = !this.isFontHighlighterOpen;
    if (this.isFontHighlighterOpen) {
      this.isFontDropdownOpen = false;
      this.isupperLowerCaseOpen = false;
      this.isheadingDropdownOpen = false;
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
  
  private replaceSelectedText(transformFn: (text: string) => string): void {
    const { state } = this.editor;
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
  
  onFontHighlightSelect(color: string): void {
    this.selectedHighlightHex = color;
    this.editor?.chain().focus().setHighlight({ color }).run();
    this.isFontHighlighterOpen = false;
  }
  
  clearHighlight(): void {
    this.editor?.chain().focus().unsetHighlight().run();
    this.selectedHighlightHex = null;
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
}