import { 
  Component, 
  ChangeDetectionStrategy, 
  Input, 
  Output, 
  EventEmitter, 
  AfterViewInit, 
  OnDestroy, 
  ViewChild, 
  ElementRef, 
  ChangeDetectorRef, 
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { CustomHighlight } from '../../add-task.models';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, ToolbarComponent ],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RichTextEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @Input() initialContent: string = '';
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  
  editor!: Editor;
  isEditorFocused: boolean = false;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.editor?.commands.focus();
    });
    this.initializeEditor();
    this.cdr.detectChanges();
  }
  
  private initializeEditor(): void {
    if (this.editor) return;
    this.editor = new Editor({
      element: this.editorContainer.nativeElement,
      content: this.initialContent,
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        Image.configure({ allowBase64: true }),
        CustomHighlight
      ],
      editorProps: { attributes: { class: 'ProseMirror' } },
      onFocus: () => {
        this.isEditorFocused = true;
        this.cdr.detectChanges();
      },
      onBlur: ({ event }) => {
        setTimeout(() => {
          const activeEl = document.activeElement;
          const stillInToolbar =
            activeEl?.closest('.editor-toolbar') ||
            activeEl?.closest('.editor-wrapper');
          if (!stillInToolbar) {
            this.isEditorFocused = false;
            this.cdr.detectChanges();
          }
        }, 10);
      }
    });
  }
  
  ngOnDestroy(): void {
    this.editor?.destroy();
  }
  
  onSave(): void {
    if (this.editor) {
      this.save.emit(this.editor.getHTML());
    }
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.editor-wrapper');
    if (!clickedInside) {
      this.isEditorFocused = false;
    } else {
      this.isEditorFocused = true;
    }
    this.cdr.detectChanges();
  }
}