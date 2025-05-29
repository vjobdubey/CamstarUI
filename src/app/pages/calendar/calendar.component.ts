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
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { TableDataService } from '../../services/table-data.service';
import { CorporateAction } from '../../models/table.model';
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
  parseISO
} from 'date-fns';

type ViewType = 'month' | 'week' | 'day';

interface CalendarDay {
  date: Date;
  events: CorporateAction[];
  isCurrentMonth: boolean;
}

interface TimeSlot {
  time: Date;
  events: CorporateAction[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
    FontAwesomeModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
 currentDate = new Date();
  currentView: ViewType = 'month';
  weeks: CalendarDay[][] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  events: CorporateAction[] = [];
  actionTypes: string[] = [];
  selectedActionType = 'all';
  selectedDay: CalendarDay | null = null;
  currentWeekDays: Date[] = [];
  timeSlots: { time: Date }[] = [];
  
  todayEvents: CorporateAction[] = [];
  urgentEvents: CorporateAction[] = [];
  upcomingEvents: CorporateAction[] = [];

  // Font Awesome icons
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faCalendarDay = faCalendarDay;
  faExclamationTriangle = faExclamationTriangle;
  faCalendarWeek = faCalendarWeek;
  faFilter = faFilter;
  faCalendarAlt = faCalendarAlt;

  constructor(private dataService: TableDataService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.dataService.getCorporateActions().subscribe(actions => {
      this.events = actions;
      this.actionTypes = [...new Set(actions.map(action => action.actionType))];
      this.generateCalendarData();
      this.updateEventSummaries();
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
    const days = eachDayOfInterval({ start: startOfWeek(start), end: endOfWeek(end) });

    this.weeks = [];
    let currentWeek: CalendarDay[] = [];

    days.forEach(date => {
      if (currentWeek.length === 7) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }

      const dayEvents = this.getEventsForDate(date);
      currentWeek.push({
        date,
        events: dayEvents,
        isCurrentMonth: date.getMonth() === this.currentDate.getMonth()
      });
    });

    if (currentWeek.length > 0) {
      this.weeks.push(currentWeek);
    }
  }

  generateWeekView() {
    const weekStart = startOfWeek(this.currentDate);
    this.currentWeekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    const dayStart = startOfDay(this.currentDate);
    this.timeSlots = Array.from({ length: 24 }, (_, i) => ({
      time: addDays(dayStart, i)
    }));
  }

  generateDayView() {
    const dayStart = startOfDay(this.currentDate);
    const dayEnd = endOfDay(this.currentDate);
    this.timeSlots = eachHourOfInterval({ start: dayStart, end: dayEnd }).map(time => ({
      time,
      events: this.getEventsForHour(time)
    }));
  }

  getEventsForHour(time: Date): CorporateAction[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.announcementDate);
      return eventDate.getHours() === time.getHours() &&
             isSameDay(eventDate, this.currentDate) &&
             (this.selectedActionType === 'all' || event.actionType === this.selectedActionType);
    });
  }

  getDayEvents(): CorporateAction[] {
    return this.getEventsForDate(this.currentDate);
  }

  getDayTimeSlots(): TimeSlot[] {
    const dayStart = startOfDay(this.currentDate);
    const dayEnd = endOfDay(this.currentDate);
    return eachHourOfInterval({ start: dayStart, end: dayEnd }).map(time => ({
      time,
      events: this.getEventsForHour(time)
    }));
  }

  getEventsForDate(date: Date): CorporateAction[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.announcementDate);
      return isSameDay(eventDate, date) &&
             (this.selectedActionType === 'all' || event.actionType === this.selectedActionType);
    });
  }

  updateEventSummaries() {
    const today = new Date();
    this.todayEvents = this.events.filter(event => 
      isSameDay(new Date(event.announcementDate), today)
    );
    
    this.urgentEvents = this.events.filter(event => event.isUrgent);
    
    this.upcomingEvents = this.events.filter(event => 
      new Date(event.announcementDate) > today
    );
  }

  getHeaderText(): string {
    switch (this.currentView) {
      case 'month':
        return format(this.currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(this.currentDate);
        const weekEnd = endOfWeek(this.currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
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
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + amount);
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
