import { ColDef } from 'ag-grid-community';
import { ColumnGroup } from '../models/table.model';

const columnGroups: ColumnGroup[] = [
  {
    id: 'events',
    label: 'Events',
    collapsed:false,
    columns: [
      {
        headerName: 'Event ID',
        field: 'EventID',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'SEDOL',
        field: 'SEDOL',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Stock Name',
        field: 'StockName',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'CA Type',
        field: 'CAType',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Ex-Date',
        field: 'Date1',
        hide: true,
        sortable: true,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: 'Rec Date',
        field: 'Date2',
        hide: true,
        sortable: true,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: 'Deadline',
        field: 'CADeadline',
        hide: true,
        sortable: true,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: 'Pay Date',
        field: 'Date2',
        hide: true,
        sortable: true,
        filter: 'agDateColumnFilter',
      },
    ],
  },
  {
    id: 'position',
    label: 'Position',
    collapsed:false,
    columns: [
      {
        headerName: 'Stock ID',
        field: 'StockID',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Position Size',
        field: 'PositionSize',
        hide: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Customer ID',
        field: 'CustomerId',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Customer Name',
        field: 'CustomerName',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Business Line',
        field: 'BusinessLine',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Entitled Position',
        field: 'EntitledPosition',
        hide: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
      },
    ],
  },
  {
    id: 'electionDetails',
    label: 'Election Details',
    collapsed:false,
    columns: [
      {
        headerName: 'Response Type',
        field: 'ResponseType',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Response Detail',
        field: 'ResponseDetail',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Election Status',
        field: 'ElectionStatus',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Booking Status',
        field: 'BookingStatus',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Posting Status',
        field: 'PostingStatus',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Trader Comment',
        field: 'TraderComment',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Action Owner',
        field: 'LastSeenOrUpdatedBy',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Last Action',
        field: 'LastAction',
        hide: true,
        sortable: true,
        filter: 'agTextColumnFilter',
      },
    ],
  },
];

const columnDefs: ColDef[] = [
  // {
  //   field: 'id',
  //   headerName: 'ID',
  //   width: 80,
  //   sortable: true,
  //   filter: 'agNumberColumnFilter',
  //   checkboxSelection: true,
  //   headerCheckboxSelection: true,
  //   hide: false
  // },
  {
    field: 'EventID',
    headerName: 'Event ID',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'SEDOL',
    headerName: 'SEDOL',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'StockID',
    headerName: 'Stock ID',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
    enableRowGroup: true,
  },
  {
    field: 'StockName',
    headerName: 'Stock Name',
    sortable: true,
    filter: 'agTextColumnFilter', //agDateColumnFilter
    flex: 1,
    hide: false,
    enableRowGroup: true,
  },
  {
    field: 'CAType',
    headerName: 'CA Type',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'CADeadline',
    headerName: 'CA Deadline',
    sortable: true,
    filter: 'agDateColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'Date1',
    headerName: 'Date 1',
    sortable: true,
    filter: 'agDateColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'Date2',
    headerName: 'Date 2',
    sortable: true,
    filter: 'agDateColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'PositionSize',
    headerName: 'Position Size',
    sortable: true,
    filter: 'agNumberColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'CustomerId',
    headerName: 'Customer Id',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'CustomerName',
    headerName: 'Customer Name',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'BusinessLine',
    headerName: 'Business Line',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'EntitledPosition',
    headerName: 'Entitled Position',
    sortable: true,
    filter: 'agNumberColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'ResponseType',
    headerName: 'Response Type',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'ResponseDetail',
    headerName: 'Response Detail',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'ElectionStatus',
    headerName: 'Election Status',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'BookingStatus',
    headerName: 'Booking Status',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'PostingStatus',
    headerName: 'Posting Status',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'TraderComment',
    headerName: 'Trader Comment',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'LastSeenOrUpdatedBy',
    headerName: 'Last Seen',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  {
    field: 'LastAction',
    headerName: 'Last Action',
    sortable: true,
    filter: 'agTextColumnFilter',
    flex: 1,
    hide: false,
  },
  // {
  //   field: 'status',
  //   headerName: 'Status',
  //   sortable: true,
  //   filter: 'agTextColumnFilter',
  //   width: 120,
  //   hide: false,
  //   cellRenderer: (params: any) => {
  //     const status = params.value;
  //     let statusClass = '';

  //     switch (status.toLowerCase()) {
  //       case 'completed':
  //         statusClass = 'status-active';
  //         break;
  //       case 'pending':
  //         statusClass = 'status-pending';
  //         break;
  //       case 'active':
  //         statusClass = 'status-inactive';
  //         break;
  //     }

  //     return `<span class="status-pill ${statusClass}">${status}</span>`;
  //   }
  // }
];

export { columnDefs, columnGroups };
