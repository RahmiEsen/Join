import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DescriptionViewComponent } from './description-view/description-view.component';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-task-description',
  standalone: true,
  imports: [CommonModule, DescriptionViewComponent, RichTextEditorComponent],
  templateUrl: './task-description.component.html',
  styleUrls: ['./task-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskDescriptionComponent implements OnChanges {
  @ViewChild('descriptionView', { read: ElementRef }) descriptionViewRef!: ElementRef;
  @ViewChild(DescriptionViewComponent, { read: ElementRef }) descriptionPreviewRef!: ElementRef<HTMLDivElement>;
  @Input() initialDescription: string = '';
  @Input() isExpanded: boolean = false;
  @Output() descriptionSaved = new EventEmitter<string>();
  
  editorVisible = false;
  savedDescription: string = '';
  safeSavedDescription: SafeHtml = '';
  isDescriptionOverflowing = false;
  isDescriptionExpanded = false;
  
  constructor(
    private sanitizer: DomSanitizer, 
    private cdr: ChangeDetectorRef) 
  {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialDescription']) {
      this.savedDescription = this.initialDescription;
      this.safeSavedDescription = this.sanitizer.bypassSecurityTrustHtml(this.savedDescription);
      this.runOverflowCheckWhenReady();
    }
  }
  
  showEditor(): void {
    this.editorVisible = true;
  }
  
  editDescription(): void {
    this.editorVisible = true;
  }
  
  cancelDescription(): void {
    this.editorVisible = false;
  }
  
  saveDescription(newContent: string): void {
    if (this.isEmptyContent(newContent)) {
      this.savedDescription = '';
      this.safeSavedDescription = '';
      this.isDescriptionExpanded = false;
      this.editorVisible = false;
      this.runOverflowCheckWhenReady();
      return;
    }
    this.savedDescription = newContent;
    this.safeSavedDescription = this.sanitizer.bypassSecurityTrustHtml(this.savedDescription);
    this.isDescriptionExpanded = false;
    this.runOverflowCheckWhenReady();
    this.editorVisible = false;
    this.descriptionSaved.emit(this.savedDescription);
  }
  
  private isEmptyContent(content: string): boolean {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = content;
    const textContent = tempElement.textContent;
    const hasText = !!textContent && textContent.trim().length > 0;
    const hasImage = tempElement.querySelector('img') !== null;
    return !hasText && !hasImage;
  }
  
  private checkOverflow(): void {
    if (!this.descriptionPreviewRef) return;
    const element = this.descriptionPreviewRef.nativeElement.querySelector('.description-preview');
    if (!element) return;
    const isOverflowing = element.scrollHeight > element.clientHeight;
    if (isOverflowing !== this.isDescriptionOverflowing) {
        this.isDescriptionOverflowing = isOverflowing;
        this.cdr.detectChanges();
    }
  }
  
  private runOverflowCheckWhenReady(): void {
    setTimeout(() => this.checkOverflow(), 0);
  }
  
  private scrollContainerToBottom(): void {
    const scrollContainer = this.findScrollContainer(this.descriptionViewRef.nativeElement);
    if (!scrollContainer) return;
    scrollContainer.scrollBy({
      top: scrollContainer.scrollHeight,
      behavior: 'smooth'
    });
  }
  
  private findScrollContainer(el: HTMLElement): HTMLElement | null {
    let parent = el.parentElement;
    while (parent) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }
  
  toggleDescriptionExpansion(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
    if (this.isDescriptionExpanded) {
      setTimeout(() => {
        this.scrollContainerToBottom();
      }, 300);
    }
  }
}