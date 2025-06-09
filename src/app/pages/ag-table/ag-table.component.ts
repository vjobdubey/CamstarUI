import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TableDataService } from '../../services/table-data.service';
import { Column, ColumnGroup, CorporateAction } from '../../models/table.model';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ApiDataService } from '../../services/api-data-service';
import { HttpClientModule } from '@angular/common/http';
import { columnDefs, columnGroups } from '../../utils/tableConfig';
import { MatIconModule } from '@angular/material/icon';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

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
  ],
  providers: [ApiDataService],
  templateUrl: './ag-table.component.html',
  styleUrl: './ag-table.component.scss',
})
export class AgTableComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  // FontAwesome icons
  faFilter = faFilter;

  private gridApi!: GridApi;
  public rowData: any[] = []; //CorporateAction
  public selectedRows: any[] = [];
  public showColumnMenu = false;
  protected showFilters = false;

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
    this.apiDataService.get('ca/election').subscribe({
      next: (data: any) => {
        let newData = data.map((e: any, number: number) => {
          return {
            ...e,
            id: number + 1,
          };
        });
        this.rowData = newData;
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
}
