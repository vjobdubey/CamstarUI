import { ColDef } from 'ag-grid-community';

export interface CorporateAction1 {
  EventID: string;
  SEDOL: string;
  StockName: string;
  CAType: string;
  CADeadline: Date;
  Date1: Date;
  Date2: Date;
  StockID: string;
  PositionSize: number;
  CustomerId: string;
  CustomerName: string;
  BusinessLine: string;
  EntitledPosition: number;
  ResponseType: string;
  ResponseDetail: string;
  ElectionStatus: string;
  BookingStatus: string;
  PostingStatus: string;
  TraderComment: string;
  LastSeenOrUpdatedBy: string;
  LastAction: string;
}

export interface CorporateAction {
  id: number;
  actionType: string;
  company: string;
  announcementDate: string;
  recordDate: string;
  paymentDate: string;
  ratio: string;
  status: string;
  customer?: string;
  businessLine?: string;
  positionSize?: number;
  entitledPosition?: number;
  electionQuantity?: number;
  electionPrice?: number;
  isUrgent?: boolean;
}

export interface CorporateActionEvent {
  EventID: number;
  SEDOL: string;
  StockName: string;
  CAType: string;
  CADeadline: string;
  Date1: string;
  Date2: string;
  isUrgent: boolean;
  status: string;
}

export interface CorporateActionEventDetails {

}

export interface Column {
  id: string;
  headerName: string;
  field: keyof CorporateAction1;
  hide: boolean;
  sortable?: boolean;
  width?: string;
  filter?: string;
  // render?: (value: any, row: CorporateAction1) => React.ReactNode;
}

export interface ColumnGroup {
  id: string;
  label: string;
  columns: ColDef[];
  collapsed: boolean;
}
