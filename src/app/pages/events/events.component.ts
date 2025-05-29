import { Component, OnInit } from '@angular/core';
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
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { TableDataService } from '../../services/table-data.service';
import { CorporateAction } from '../../models/table.model';

interface FilterCondition {
  group: string;
  field: string;
  operator: string;
  value: string;
}
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule, FontAwesomeModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit {
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

  events: CorporateAction[] = [];
  filteredEvents: CorporateAction[] = [];
  searchText = '';
  showFilters = false;
  expandedEventId: number | null = null;
  filterConditions: FilterCondition[] = [
    { group: 'events', field: 'actionType', operator: 'contains', value: '' }
  ];

  constructor(private dataService: TableDataService) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.dataService.getCorporateActions().subscribe(actions => {
      this.events = actions;
      this.applyFilters();
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  toggleEventDetails(eventId: number) {
    this.expandedEventId = this.expandedEventId === eventId ? null : eventId;
  }

  addFilter() {
    this.filterConditions.push({
      group: 'events',
      field: 'actionType',
      operator: 'contains',
      value: ''
    });
  }

  removeFilter(index: number) {
    this.filterConditions.splice(index, 1);
    this.applyFilters();
  }

  resetFilters() {
    this.searchText = '';
    this.filterConditions = [
      { group: 'events', field: 'actionType', operator: 'contains', value: '' }
    ];
    this.showFilters = false;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.events];

    // Apply search text
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(event =>
        event.company.toLowerCase().includes(searchLower) ||
        event.actionType.toLowerCase().includes(searchLower) ||
        event.customer?.toLowerCase().includes(searchLower) ||
        event.businessLine?.toLowerCase().includes(searchLower) ||
        event.status.toLowerCase().includes(searchLower)
      );
    }

    // Apply filter conditions
    this.filterConditions.forEach(condition => {
      if (condition.value) {
        filtered = filtered.filter(event => {
          const fieldValue = String(event[condition.field as keyof CorporateAction] || '').toLowerCase();
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
