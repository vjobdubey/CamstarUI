import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCalendarDay,
  faExclamationTriangle,
  faCalendarWeek,
  faFilter,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { TableDataService } from '../../services/table-data.service';
import { CorporateAction, CorporateAction1 } from '../../models/table.model';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addDays,
  startOfDay,
  endOfDay,
  isSameDay,
  eachHourOfInterval,
  parseISO,
} from 'date-fns';
import { ApiDataService } from '../../services/api-data-service';
import { MatTableModule } from '@angular/material/table';

type ViewType = 'month' | 'week' | 'day';

interface CalendarDay {
  date: Date;
  events: CorporateAction1[];
  isCurrentMonth: boolean;
  open?: number;
  closed?: number;
  urgent?: number;
}

interface TimeSlot {
  time: Date;
  events: CorporateAction1[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    FontAwesomeModule,
    MatTableModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  currentDate = new Date();
  currentView: ViewType = 'month';
  weeks: CalendarDay[][] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  events: CorporateAction1[] = [];
  actionTypes: string[] = [];
  selectedActionType = 'all';
  selectedDay: CalendarDay | null = null;
  currentWeekDays: Date[] = [];
  timeSlots: { time: Date }[] = [];

  todayEvents: CorporateAction1[] = [];
  urgentEvents: CorporateAction1[] = [];
  upcomingEvents: CorporateAction1[] = [];

  // Font Awesome icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCalendarDay = faCalendarDay;
  faExclamationTriangle = faExclamationTriangle;
  faCalendarWeek = faCalendarWeek;
  faFilter = faFilter;
  faCalendarAlt = faCalendarAlt;

  protected displayedColumns = ['EventID','CAType','StockName','CADeadline','Date2','ElectionStatus']

  constructor(
    private dataService: TableDataService,
    private apiDataService: ApiDataService
  ) {}

  ngOnInit() {
    // this.loadEvents();
    this.fetchData();
  }

  // loadEvents() {
  //   this.dataService.getCorporateActions().subscribe(actions => {
  //     this.events = actions;
  //     this.actionTypes = [...new Set(actions.map(action => action.actionType))];
  //     this.generateCalendarData();
  //     this.updateEventSummaries();
  //   });
  // }

  private fetchData(): void {
    this.apiDataService.get<CorporateAction1[]>('ca/election').subscribe({
      next: (data: CorporateAction1[]) => {
        let newData = data.map((e: CorporateAction1, number: number) => {
          return {
            ...e,
            id: number + 1,
          };
        });
        // this.rowData = newData;
        this.events = newData;
        this.actionTypes = [...new Set(newData.map((action) => action.CAType))];
        this.generateCalendarData();
        this.updateEventSummaries();
      },
      error: (err) => {
        console.error('API Error:', err);
        alert(err.message); // Customize as needed
      },
    });
  }

  generateCalendarData() {
    switch (this.currentView) {
      case 'month':
        this.generateMonthView();
        break;
      case 'week':
        this.generateWeekView();
        break;
      case 'day':
        this.generateDayView();
        break;
    }
  }

  generateMonthView() {
    const start = startOfMonth(this.currentDate);
    const end = endOfMonth(this.currentDate);
    const days = eachDayOfInterval({
      start: startOfWeek(start),
      end: endOfWeek(end),
    });

    this.weeks = [];
    let currentWeek: CalendarDay[] = [];

    days.forEach((date) => {
      if (currentWeek.length === 7) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }

      const dayEvents = this.getEventsForDate(date);
      const open = dayEvents.filter(
        (e: CorporateAction1) =>
          e.ElectionStatus.toLocaleLowerCase() === 'n/a'
      ).length;
      const closed = dayEvents.filter(
        (e: CorporateAction1) =>
          e.ElectionStatus.toLocaleLowerCase() === 'completed' ||
          (e.ElectionStatus.toLocaleLowerCase() === 'Submitted')
      ).length;
      currentWeek.push({
        date,
        events: dayEvents,
        isCurrentMonth: date.getMonth() === this.currentDate.getMonth(),
        open,
        closed,
        urgent : dayEvents.length - (open + closed),
      });
    });

    if (currentWeek.length > 0) {
      this.weeks.push(currentWeek);
    }
  }

  generateWeekView() {
    const weekStart = startOfWeek(this.currentDate);
    this.currentWeekDays = Array.from({ length: 7 }, (_, i) =>
      addDays(weekStart, i)
    );

    const dayStart = startOfDay(this.currentDate);
    this.timeSlots = Array.from({ length: 24 }, (_, i) => ({
      time: addDays(dayStart, i),
    }));
  }

  generateDayView() {
    const dayStart = startOfDay(this.currentDate);
    const dayEnd = endOfDay(this.currentDate);
    this.timeSlots = eachHourOfInterval({ start: dayStart, end: dayEnd }).map(
      (time) => ({
        time,
        events: this.getEventsForHour(time),
      })
    );
  }

  getEventsForHour(time: Date): CorporateAction1[] {
    return this.events.filter((event) => {
      const eventDate = new Date(event.Date1);
      return (
        eventDate.getHours() === time.getHours() &&
        isSameDay(eventDate, this.currentDate) &&
        (this.selectedActionType === 'all' ||
          event.CAType === this.selectedActionType)
      );
    });
  }

  getDayEvents(): CorporateAction1[] {
    return this.getEventsForDate(this.currentDate);
  }

  getDayTimeSlots(): TimeSlot[] {
    const dayStart = startOfDay(this.currentDate);
    const dayEnd = endOfDay(this.currentDate);
    return eachHourOfInterval({ start: dayStart, end: dayEnd }).map((time) => ({
      time,
      events: this.getEventsForHour(time),
    }));
  }

  getEventsForDate(date: Date): CorporateAction1[] {
    return this.events.filter((event) => {
      const eventDate = new Date(event.Date1);
      return (
        isSameDay(eventDate, date) &&
        (this.selectedActionType === 'all' ||
          event.CAType === this.selectedActionType)
      );
    });
  }
  

  updateEventSummaries() {
    const today = new Date();
    this.todayEvents = this.events.filter((event) =>
      isSameDay(new Date(event.Date1), today)
    );

    this.urgentEvents = this.events.filter((event) => event?.isUrgent);

    this.upcomingEvents = this.events.filter(
      (event) => new Date(event.Date1) > today
    );
  }

  getHeaderText(): string {
    switch (this.currentView) {
      case 'month':
        return format(this.currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(this.currentDate);
        const weekEnd = endOfWeek(this.currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(
          weekEnd,
          'MMM d, yyyy'
        )}`;
      case 'day':
        return format(this.currentDate, 'EEEE, MMMM d, yyyy');
      default:
        return '';
    }
  }

  navigate(direction: 'prev' | 'next') {
    const amount = direction === 'prev' ? -1 : 1;

    switch (this.currentView) {
      case 'month':
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + amount
        );
        break;
      case 'week':
        this.currentDate = addDays(this.currentDate, amount * 7);
        break;
      case 'day':
        this.currentDate = addDays(this.currentDate, amount);
        break;
    }

    this.generateCalendarData();
    this.selectedDay = null;
  }

  onViewChange() {
    this.generateCalendarData();
    this.selectedDay = null;
  }

  format(date: Date | string, formatStr: string): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  }

  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  isSelectedDate(date: Date): boolean {
    return !!(this.selectedDay?.date && isSameDay(this.selectedDay.date, date));
  
  }

  selectDate(day: CalendarDay) {
    this.selectedDay = day; 
  }

  goToToday() {
    this.currentDate = new Date();
    this.generateCalendarData();
    this.selectedDay = null;
  }

  filterEvents() {
    this.generateCalendarData();
    this.selectedDay = null;
  }
}
