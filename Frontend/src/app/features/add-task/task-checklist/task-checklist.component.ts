import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChildren,
  QueryList,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { trigger, transition, style, animate, group, state, query } from '@angular/animations';
import { FormsModule } from '@angular/forms'; 

const effectDuration = '275ms';
const easeInCurve = 'cubic-bezier(0.55, 0, 0.675, 0.2)';
const easeOutCurve = 'cubic-bezier(0.3, 0.75, 0.45, 1)'; 

@Component({
  selector: 'app-task-checklist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './task-checklist.component.html',
  styleUrl: './task-checklist.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('buttonFadeScale', [
      transition(':enter', [
        style({
          transformOrigin: 'top', 
          opacity: 0,
          transform: 'translateY(-55px) scaleY(1) scaleX(-.2)'
        }),
        animate(`${effectDuration} ${easeOutCurve}`, style({
          opacity: 1,
          transform: 'translateY(0) scaleY(1) scaleX(1)'
        }))
      ]),
      transition(':leave', [
        style({ transformOrigin: 'top center' }),
        animate(`${effectDuration} ${easeInCurve}`, style({
          opacity: 0,
          transform: 'translateY(-25px) scaleY(0.15) scaleX(0.2)',
          height: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          margin: '0px'
        }))
      ])
    ]),
    trigger('elementSlideFade', [
      transition(':enter', [
        style({
          transformOrigin: 'bottom center',
          opacity: 0,
          transform: 'scaleY(0) scaleX(0) translateY(55px)'
        }),
        animate(`${effectDuration} ${easeOutCurve}`, style({
          opacity: 1,
          transform: 'scaleY(1) scaleX(1) translateY(0)'
        }))
      ]),
      transition(':leave', [
        style({ transformOrigin: 'bottom center' }),
        animate(`${effectDuration} ${easeInCurve}`, style({
          opacity: 0,
          transform: 'scaleY(0) scaleX(0.2) translateY(55px)',
          height: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          margin: '0px'
        }))
      ])
    ]),
    trigger('inputGrow', [
      state('default', style({})),
      state('focused', style({})),
      transition('default => focused', [
        group([
          query('input', [
            animate('300ms ease-out', style({}))
          ]),
          query('button', [
            style({ transformOrigin: 'right' }),
            animate('300ms ease-out', style({
              opacity: 0,
              width: '0px',
              padding: '0px',
              transform: 'scaleX(0)'
            }))
          ])
        ])
      ]),
      transition('focused => default', [
        group([
          query('input', [
            animate('300ms ease-out')
          ]),
          query('button', [
            style({
              transformOrigin: 'right',
              opacity: 0,
              width: '0px',
              padding: '0px',
              transform: 'scaleX(0)'
            }),
            animate('300ms ease-out', style({
              opacity: 1,
              width: '*',
              padding: '*',
              transform: 'scaleX(1)'
            }))
          ])
        ])
      ])
    ]),
  ]
})

export class TaskChecklistComponent implements AfterViewChecked {
  @ViewChild('wrapper') private wrapperRef?: ElementRef<HTMLDivElement>;
  @ViewChildren('taskItem') private taskItems!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('editInput') private editInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Input() title: string = '';
  @Output() checklistDeleted = new EventEmitter<void>();
  
  
  public showAddElement = false;
  public titleInputFocused = false;
  public tasks: { text: string; checked: boolean }[] = [];  
  public newTaskText: string = '';
  public editingTaskIndex: number | null = null;
  public editText: string = '';
  private isInitialEdit = false;
  public progress = 0;
  public areCompletedTasksHidden = false;
  public previousValidTitle: string = '';
  public activeDropdown: { taskIndex: number; type: 'date' | 'assign' } | null = null;
  
  constructor(private cd: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    if (this.title.trim()) {
      this.previousValidTitle = this.title.trim();
    } else {
      this.previousValidTitle = 'Neue Checkliste';
    }
  }
  
  ngAfterViewChecked(): void {
    if (this.editingTaskIndex !== null && this.isInitialEdit) {
      const inputEl = this.editInputs.get(0)?.nativeElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
        this.isInitialEdit = false; 
      }
    }
  }
  
  public toggleTaskChecked(index: number): void {
    this.tasks[index].checked = !this.tasks[index].checked;
    this.updateProgress();
  }
  
  public openAddElement(event: MouseEvent): void {
    event.stopPropagation();
    this.showAddElement = true;
  }
  
  public cancelAddElement(): void {
    this.showAddElement = false;
  }
  
  public stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
  
  public onTitleFocus() {
    this.titleInputFocused = true;
  }
  
  public onTitleBlur(): void {
    this.titleInputFocused = false;
    const trimmed = this.title.trim();
    if (trimmed.length === 0) {
      this.title = '';
      this.title = this.previousValidTitle;
    } else {
      this.previousValidTitle = trimmed;
    }
  }
  
  @HostListener('document:click', ['$event'])
  private onOutsideClick(event: MouseEvent): void {
    const target = event.target as Node;
    if (this.showAddElement && this.wrapperRef && !this.wrapperRef.nativeElement.contains(target)) {
      this.cancelAddElement();
    }
    if (this.editingTaskIndex !== null) {
      const editingTaskElement = this.taskItems.get(this.editingTaskIndex)?.nativeElement;
      if (editingTaskElement && !editingTaskElement.contains(target)) {
        this.saveTaskText(this.editingTaskIndex);
      }
    }
  }
  
  public addTask(): void {
    const trimmed = this.newTaskText.trim();
    if (trimmed.length > 0) {
      this.tasks.push({ text: trimmed, checked: false });
      this.newTaskText = '';
      this.showAddElement = false;
      this.updateProgress();
    }
  }
  
  public startEditingTask(index: number): void {
    if (this.editingTaskIndex !== null) {
      this.saveTaskText(this.editingTaskIndex);
    }
    this.editingTaskIndex = index;
    this.editText = this.tasks[index].text;
    this.isInitialEdit = true;
  }
  
  public cancelEditTask(): void {
    this.editingTaskIndex = null;
    this.editText = '';
  }
  
  public saveTaskText(index: number): void {
    if (this.tasks[index]) { 
      const trimmed = this.editText.trim();
      if (trimmed.length > 0) {
        this.tasks[index].text = trimmed;
      }
      this.cancelEditTask();
      this.cd.markForCheck();
    }
  }
  
  private updateProgress(): void {
    if (this.tasks.length === 0) {
      this.progress = 0;
      return;
    }
    const checkedTasks = this.tasks.filter(task => task.checked).length;
    const totalTasks = this.tasks.length;
    this.progress = Math.round((checkedTasks / totalTasks) * 100);
  }
  
  public get completedTasksCount(): number {
    return this.tasks.filter(task => task.checked).length;
  }
  
  public toggleCompletedTasksVisibility(): void {
    this.areCompletedTasksHidden = !this.areCompletedTasksHidden;
  }
  
  public deleteChecklist(): void {
    this.checklistDeleted.emit();
  }
  
  public deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.updateProgress();
    if (this.editingTaskIndex === index) {
      this.cancelEditTask();
    }
  }
  
  public toggleDropdown(index: number, type: 'date' | 'assign'): void {
    if (this.activeDropdown && this.activeDropdown.taskIndex === index && this.activeDropdown.type === type) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = { taskIndex: index, type: type };
    }
  }
  
  public isDropdownOpen(index: number, type: 'date' | 'assign'): boolean {
    return this.activeDropdown?.taskIndex === index && this.activeDropdown?.type === type;
  }
}