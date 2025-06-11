import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TableDataService } from '../../services/table-data.service';
import {
  Column,
  ColumnGroup,
  CorporateAction,
  CorporateAction1,
} from '../../models/table.model';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ApiDataService } from '../../services/api-data-service';
import { HttpClientModule } from '@angular/common/http';
import { columnDefs, columnGroups } from '../../utils/tableConfig';
import { MatIconModule } from '@angular/material/icon';
import {
  faBookmark,
  faFilter,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface FilterCondition {
  group: string;
  field: string;
  operator: string;
  value: string;
}

ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-ag-table',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule,
    HttpClientModule,
    MatIconModule,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  providers: [ApiDataService],
  templateUrl: './ag-table.component.html',
  styleUrl: './ag-table.component.scss',
})
export class AgTableComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  // FontAwesome icons
  faFilter = faFilter;
  faTrash = faTrash;
  faPlus = faPlus;
  faBookmark = faBookmark;

  private gridApi!: GridApi;
  public rowData: CorporateAction1[] = []; //CorporateAction
  public filteredrowData: CorporateAction1[] = [];
  public selectedRows: any[] = [];
  protected presets: { name: string; filter: FilterCondition }[] = [];
  public showColumnMenu = false;
  protected showFilters = false;
  protected filterConditions: FilterCondition = {
    group: 'events',
    field: 'EventID',
    operator: 'Equals',
    value: '',
  };
  protected appliedCondition: FilterCondition[] = [];
  protected groupFilter: { label: string; value: string }[] = [
    { label: 'Events', value: 'events' },
  ];
  protected fieldFilter: { label: string; value: string }[] = [
    { label: 'EventID', value: 'EventID' },
    { label: 'SEDOL', value: 'SEDOL' },
    { label: 'Position', value: 'position' },
    { label: 'Deadline', value: 'CADeadline' },
    { label: 'Stock Name', value: 'StockName' },
  ];
  protected operatorFilter: { label: string; value: string }[] = [
    { label: 'Contains', value: 'Contains' },
    { label: 'Equals', value: 'Equals' },
    { label: 'Starts with', value: 'Starts with' },
    { label: 'Ends with', value: 'Ends with' },
  ];
  public sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
    ],
  };

  public columnDefs: ColDef[] = []; //columnDefs
  public columnGroups: ColumnGroup[] = columnGroups;
  public defaultColDef: ColDef = {
    resizable: true,
    minWidth: 100,
    filter: true,
  };
  protected searchText: string = '';
  protected newPresetName: string = '';
  protected showPresets: boolean = false;
  protected showSaveInput: boolean = false;

  constructor(
    private dataService: TableDataService,
    private apiDataService: ApiDataService
  ) {}

  ngOnInit(): void {
    this.columnInit();
    this.fetchData();
  }

  columnInit(): void {
    let newColumnDef: ColDef[] = [];
    columnGroups.forEach((e: ColumnGroup) => {
      e.columns.forEach((e: ColDef) => {
        newColumnDef.push({
          field: e.field,
          headerName: e.headerName,
          sortable: e.sortable,
          filter: e.filter,
          flex: 1,
          hide: !e.hide,
        });
      });
    });
    this.columnDefs = newColumnDef;
  }

  fetchData(): void {
    this.apiDataService.get<CorporateAction1[]>('ca/election').subscribe({
      next: (data: any) => {
        let newData = data.map((e: any, number: number) => {
          return {
            ...e,
            id: number + 1,
          };
        });
        this.rowData = newData;
        this.filteredrowData = this.applyDefaultFilter(this.filterConditions);
      },
      error: (err) => {
        console.error('API Error:', err);
        alert(err.message); // Customize as needed
      },
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 0);
  }

  onSelectionChanged(): void {
    this.selectedRows = this.gridApi.getSelectedRows();
  }

  clearSelection(): void {
    this.gridApi.deselectAll();
  }

  onFilterTextBoxChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gridApi.setGridOption('quickFilterText', input.value);
  }

  exportToCsv(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'corporate-actions.csv',
    });
  }

  openColumnVisibilityMenu(): void {
    this.showColumnMenu = true;
  }

  toggleColumn(col: ColDef): void {
    col.hide = !col.hide;
    this.columnDefs = this.columnDefs.map((column) => {
      return {
        ...column,
        hide: col.field == column.field ? !col.hide : column.hide,
      };
    });
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
  }

  selectAllColumns(visible: boolean): void {
    this.columnDefs.forEach((col) => {
      col.hide = !visible;
    });
    this.gridApi.setGridOption('columnDefs', this.columnDefs);
  }

  resetFilters(): void {
    this.gridApi.setFilterModel(null);
    this.gridApi.setGridOption('quickFilterText', '');
    const inputElement = document.querySelector(
      '.search-input'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }

  toggleGroup(column: any): void {
    column.collapsed = !column.collapsed;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  protected applyFilters() {
    this.filteredrowData = this.applyDefaultFilter(this.filterConditions);
    this.appliedCondition.unshift(this.filterConditions);
    this.filterConditions = {
      group: 'events',
      field: 'EventID',
      operator: 'Equals',
      value: '',
    };
  }

  protected removeFilter(id: number): void {
    this.appliedCondition.splice(id, 1);
    if (this.appliedCondition.length) {
      this.filteredrowData = this.applyDefaultFilter(this.appliedCondition[0]);
    } else {
      this.filteredrowData = [...this.rowData];
    }
  }
  protected addSelectedFilter(id: number): void {
    if (this.appliedCondition.length) {
      this.filteredrowData = this.applyDefaultFilter(this.appliedCondition[id]);
    } else {
      this.filteredrowData = [...this.rowData];
    }
  }

  protected applyDefaultFilter(filters: FilterCondition): CorporateAction1[] {
    let filtered = [...this.rowData];

    // Apply search text
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.SEDOL.toLowerCase().includes(searchLower) ||
          event.EventID.toString().toLocaleLowerCase().includes(searchLower) ||
          event.CADeadline?.toString()?.toLowerCase().includes(searchLower) ||
          event.StockName?.toLowerCase().includes(searchLower) ||
          event.CustomerName?.toLowerCase().includes(searchLower) ||
          event.CustomerId?.toLowerCase().includes(searchLower) ||
          event.EntitledPosition?.toString()
            ?.toLowerCase()
            .includes(searchLower) ||
          event.TraderComment?.toLowerCase().includes(searchLower) ||
          event.BookingStatus?.toLowerCase().includes(searchLower) ||
          event.BusinessLine?.toLowerCase().includes(searchLower) ||
          event.PositionSize?.toString()?.toLowerCase().includes(searchLower) ||
          event.CAType.toLowerCase().includes(searchLower)
      );
    }

    // Apply filter conditions
    if (filters.value) {
      filtered = filtered.filter((event) => {
        const fieldValue = String(
          event[filters.field as keyof CorporateAction1] || ''
        ).toLowerCase();
        const filterValue = filters.value.toLowerCase();

        switch (filters.operator.toLowerCase()) {
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
    return filtered;
  }

  protected deletePreset(id: number): void {
    this.presets.splice(id, 1);
  }
  protected selectPresetFilter(id: number): void {
    this.appliedCondition= [this.presets[id].filter]
    this.addSelectedFilter(0)
  }
  protected togglePreset(): void {
    this.showPresets = !this.showPresets;
  }

  protected savePreset(): void {
    this.presets.push({
      name: this.newPresetName,
      filter: this.appliedCondition[0],
    });
    this.showSaveInput = !this.showSaveInput;
    this.newPresetName = '';
  }
  protected cancelSave(): void {
    this.showSaveInput = !this.showSaveInput;
    this.newPresetName = '';
  }
}
