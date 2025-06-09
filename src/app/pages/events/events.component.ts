import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faFilter,
  faPlus,
  faTrash,
  faRotate,
  faCalendarDay,
  faBuilding,
  faBriefcase,
  faMoneyBill,
  faChartLine,
  faExclamationTriangle,
  faChevronRight,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { TableDataService } from '../../services/table-data.service';
import {
  CorporateAction,
  CorporateActionEvent,
} from '../../models/table.model';
import { ApiDataService } from '../../services/api-data-service';

interface FilterCondition {
  group: string;
  field: string;
  operator: string;
  value: string;
}
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  // FontAwesome icons
  faSearch = faSearch;
  faFilter = faFilter;
  faPlus = faPlus;
  faTrash = faTrash;
  faRotate = faRotate;
  faCalendarDay = faCalendarDay;
  faBuilding = faBuilding;
  faBriefcase = faBriefcase;
  faMoneyBill = faMoneyBill;
  faChartLine = faChartLine;
  faExclamationTriangle = faExclamationTriangle;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;

  events: CorporateActionEvent[] = [];
  filteredEvents: CorporateActionEvent[] = [];
  searchText = '';
  showFilters = false;
  expandedEventId: number | null = null;
  filterConditions: FilterCondition[] = [
    { group: 'events', field: 'EventID', operator: 'Equals', value: '' },
  ];
  eventDetails: any = [];
  openCommentBox: boolean = false;
  newMessage: string = '';
  groupFilter: { label: string; value: string }[] = [
    { label: 'Events', value: 'events' },
  ];
  fieldFilter: { label: string; value: string }[] = [
    { label: 'EventID', value: 'EventID' },
    { label: 'SEDOL', value: 'SEDOL' },
    { label: 'Position', value: 'position' },
    { label: 'Deadline', value: 'CADeadline' },
    { label: 'Stock Name', value: 'StockName' },
  ];
  operatorFilter: { label: string; value: string }[] = [
    { label: 'Contains', value: 'Contains' },
    { label: 'Equals', value: 'Equals' },
    { label: 'Starts with', value: 'Starts with' },
    { label: 'Ends with', value: 'Ends with' },
  ];
  constructor(
    private dataService: TableDataService,
    private apiDataService: ApiDataService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.apiDataService.get('ca/event').subscribe({
      next: (data: any) => {
        if (data && data.length) {
          this.events = data.map((e: any, index: number) => {
            const date1 = new Date(e.Date1);
            const date2 = new Date(e.Date2);
            const deadline = new Date(e.CADeadline);
            return {
              ...e,
              isUrgent: date1 < deadline,
              status:
                date2 < deadline
                  ? 'Pending'
                  : date2 === deadline
                  ? 'Open'
                  : 'Completed',
            };
          });
          // this.filteredEvents = this.events;
        this.applyFilters();
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        alert(err.message); // Customize as needed
      },
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleEventDetails(eventId: number) {
    if (this.expandedEventId !== eventId) {
      this.apiDataService.get('ca/event/' + eventId).subscribe({
        next: (data: any) => {
          if (data) {
            let messages: {
              text: string;
              dateTime: string;
              isSent: boolean;
            }[] = [
              {
                text: 'Unhedged position on XYZ — risk limit breached. Advise?',
                dateTime: '2025-06-06T17:30:00Z',
                isSent: false,
              },
              {
                text: 'Waiting on final confirmation from Risk Desk.',
                dateTime: '2025-06-06T17:31:00Z',
                isSent: true,
              },
              {
                text: 'Flag if response not received by 10:30. Exposure must be updated pre-close.',
                dateTime: '2025-06-06T17:32:00Z',
                isSent: false,
              },
              {
                text: 'Copy. Will update ASAP.',
                dateTime: '2025-06-06T17:33:00Z',
                isSent: true,
              },
              {
                text: 'Okay',
                dateTime: '2025-06-06T17:35:00Z',
                isSent: false,
              },
            ];
            this.eventDetails = {
              ...data,
              urgentFlag: true,
              messages,
              link: 'https://www.wissen.com',
            };
            this.expandedEventId = eventId;
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          alert(err.message); // Customize as needed
        },
      });
    } else {
      this.expandedEventId = null;
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Scroll failed:', err);
    }
  }

  protected removeAaddUrgentFlag(eventID: number, flagStatus: boolean): void {
    this.eventDetails = { ...this.eventDetails, urgentFlag: !flagStatus };
  }

  protected openCloseComment(eventID: number): void {
    this.openCommentBox = !this.openCommentBox;
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  protected sendMessage(eventID: number): void {
    this.eventDetails.messages.push({
      text: this.newMessage,
      dateTime: new Date(),
      isSent: true,
    });
    setTimeout(() => {
      this.scrollToBottom();
      this.newMessage = '';
    }, 100);
  }
  protected cancelMessage(eventID: number): void {
    this.newMessage = '';
  }
  protected openAuroraPortal(link: string): void {
    window.open(link, '_blank');
  }

  addFilter() {
    this.filterConditions.push({
      group: 'events',
      field: 'EventID',
      operator: 'Equals',
      value: '',
    });
  }

  removeFilter(index: number) {
    this.filterConditions.splice(index, 1);
    this.applyFilters();
  }

  resetFilters() {
    this.searchText = '';
    this.filterConditions = [
      { group: 'events', field: 'EventID', operator: 'Equals', value: '' },
    ];
    this.showFilters = false;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.events];

    // Apply search text
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.SEDOL.toLowerCase().includes(searchLower) ||
          event.EventID.toString().toLocaleLowerCase().includes(searchLower) ||
          event.CADeadline?.toLowerCase().includes(searchLower) ||
          event.StockName?.toLowerCase().includes(searchLower) ||
          event.CAType.toLowerCase().includes(searchLower)
      );
    }

    // Apply filter conditions
    this.filterConditions.forEach((condition) => {
      if (condition.value) {
        filtered = filtered.filter((event) => {
          const fieldValue = String(
            event[condition.field as keyof CorporateActionEvent] || ''
          ).toLowerCase();
          const filterValue = condition.value.toLowerCase();

          switch (condition.operator) {
            case 'contains':
              return fieldValue.includes(filterValue);
            case 'equals':
              return fieldValue === filterValue;
            case 'startsWith':
              return fieldValue.startsWith(filterValue);
            case 'endsWith':
              return fieldValue.endsWith(filterValue);
            default:
              return true;
          }
        });
      }
    });

    this.filteredEvents = filtered;
  }
}
