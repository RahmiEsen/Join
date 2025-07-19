import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})

export class DateSelectorComponent implements OnInit {  
  @Output() dateSelected = new EventEmitter<{ startDate: Date | null; endDate: Date | null }>();
  
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  currentDate = new Date();
  days: { date: Date, isCurrentMonth: boolean }[] = [];
  
  public startEnabled: boolean = false;
  public endEnabled: boolean = true;
  public startDateString: string = '';
  public endDateString: string = '';
  
  readonly today = new Date();
  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  
  get currentYear(): number { return this.currentDate.getFullYear(); }
  get currentMonth(): number { return this.currentDate.getMonth(); }
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.generateCalendar();
  }
  
  generateCalendar(): void {
    this.days = [];
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const startDate = new Date(this.currentYear, this.currentMonth, 1 - startOffset);
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      this.days.push({ date, isCurrentMonth: date.getMonth() === this.currentMonth });
    }
  }
  
  onStartToggle(isEnabled: boolean): void {
    if (!isEnabled) {
      this.selectedStartDate = null;
      this.syncStartDateInputFromDate(this.selectedStartDate);
      this.syncDueDateInputFromDate(this.selectedEndDate);
      this.generateCalendar();
      this.cdr.detectChanges();
    }
  }
  
  onEndToggle(isEnabled: boolean): void {
    if (!isEnabled) {
      this.selectedEndDate = null;
      this.syncStartDateInputFromDate(this.selectedStartDate);
      this.syncDueDateInputFromDate(this.selectedEndDate);
      this.generateCalendar();
      this.cdr.detectChanges();
    }
  }
  
  private _updateSelectionState(clickedDate: Date): void {
    // Nur Fälligkeitsdatum ist aktiv
    if (this.endEnabled && !this.startEnabled) {
      this.selectedEndDate = clickedDate;
      this.selectedStartDate = null;
      return;
    }

    // Nur Startdatum ist aktiv
    if (this.startEnabled && !this.endEnabled) {
      this.selectedStartDate = clickedDate;
      this.selectedEndDate = null;
      return;
    }

    // Beide sind aktiv (Zeitraum-Modus)
    if (this.startEnabled && this.endEnabled) {
      // Fall A: Ein kompletter Zeitraum ist bereits ausgewählt ODER der Klick ist VOR dem Startdatum
      // -> Auswahl zurücksetzen und mit dem Klick neu beginnen.
      if ((this.selectedStartDate && this.selectedEndDate) || (this.selectedStartDate && clickedDate < this.selectedStartDate)) {
        this.selectedStartDate = clickedDate;
        this.selectedEndDate = null;
        return;
      }
      
      // Fall B: Es gibt ein Start-, aber kein Enddatum
      // -> Klick vervollständigt den Zeitraum.
      if (this.selectedStartDate && !this.selectedEndDate) {
        this.selectedEndDate = clickedDate;
        return;
      }

      // Fall C: Noch nichts ausgewählt
      // -> Klick setzt das Startdatum.
      this.selectedStartDate = clickedDate;
    }
  }
  
  onDayClick(day: { date: Date }): void {
    this._updateSelectionState(day.date);
    this.syncStartDateInputFromDate(this.selectedStartDate);
    this.syncDueDateInputFromDate(this.selectedEndDate);
  }
  
  private syncStartDateInputFromDate(date: Date | null): void {
    if (date) {
      this.startDateString = formatDate(date, 'dd.MM.yyyy', 'en-US');
    } else {
      this.startDateString = '';
    }
  }
  
  private syncDueDateInputFromDate(date: Date | null): void {
    if (date) {
      this.endDateString = formatDate(date, 'dd.MM.yyyy', 'en-US');
    } else {
      this.endDateString = '';
    }
  }
  
  changeMonth(delta: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + delta);
    this.currentDate = new Date(this.currentDate);
    this.generateCalendar();
  }
  
  changeYear(delta: number): void {
    this.currentDate.setFullYear(this.currentDate.getFullYear() + delta);
    this.currentDate = new Date(this.currentDate);
    this.generateCalendar();
  }
  
  isToday = (date: Date): boolean => this._isSameDate(date, this.today);
  isStart = (date: Date): boolean => this._isSameDate(date, this.selectedStartDate);
  isEnd = (date: Date): boolean => this._isSameDate(date, this.selectedEndDate);
  
  isInRange(date: Date): boolean {
    return !!(this.selectedStartDate && this.selectedEndDate &&
              date > this.selectedStartDate && date < this.selectedEndDate);
  }
  
  private _isSameDate(a: Date | null, b: Date | null): boolean {
    return !!a && !!b && a.toDateString() === b.toDateString();
  }
  private _parseDateString(dateString: string): Date | null {
    if (!dateString || dateString.trim() === '') return null;
    const match = this._matchDateParts(dateString.trim());
    if (!match) return null;
    const { day, month, year } = match;
    if (!this._isValidDate(day, month, year)) return null;
    return new Date(year, month - 1, day);
  }
  
  private _matchDateParts(input: string): { day: number; month: number; year: number } | null {
    const regex = /^(\d{1,2})[./-](\d{1,2})[./-](\d{2}|[1-2]\d{3})$/;
    const match = input.match(regex);
    if (!match) return null;
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);
    if (match[3].length === 2) {
      if (year < 30) return null;
      year += 2000;
    }
    if (year < 1900 || year > 2100) return null;
    return { day, month, year };
  }
  
  private _isValidDate(day: number, month: number, year: number): boolean {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
  
  handleDateInput(): void {
    const parsedDate = this._parseDateString(this.startDateString);
    if (!parsedDate) {
      this.syncStartDateInputFromDate(this.selectedStartDate);
      return;
    }
    if (this.selectedEndDate && parsedDate > this.selectedEndDate) {
      this.selectedStartDate = this.selectedEndDate;
      this.selectedEndDate = parsedDate;
    } else {
      this.selectedStartDate = parsedDate;
    }
    this._syncAll(this.selectedStartDate);
  }
  
  handleDueDateInput(): void {
    const parsedDate = this._parseDateString(this.endDateString);
    if (!parsedDate) {
      this.syncDueDateInputFromDate(this.selectedEndDate);
      return;
    }
    if (this.selectedStartDate && parsedDate < this.selectedStartDate) {
      this.selectedEndDate = this.selectedStartDate;
      this.selectedStartDate = parsedDate;
    } else {
      this.selectedEndDate = parsedDate;
    }
    this._syncAll(this.selectedEndDate);
  }
  
  private _syncAll(focusDate: Date | null): void {
    this.syncStartDateInputFromDate(this.selectedStartDate);
    this.syncDueDateInputFromDate(this.selectedEndDate);
    if (focusDate) {
      this.currentDate = new Date(focusDate);
    }
    this.generateCalendar();
    this.cdr.detectChanges();
    /* this._logSelection(); */
  }
  
  onSaveDates(): void {
    this.dateSelected.emit({
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate
    });
  }
}