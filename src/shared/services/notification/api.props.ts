export interface NotificationItem {
  id: string;
  priority: string;
  receivedDate: string;
  status: boolean;
  title: string;
  body: string;
}

export interface NotificationTableData {
  error: any;
  payload?: NotificationItem[];
  status: number;
  total?: number;
}

export interface AutoSuggestItem {
  title: string;
}

export interface AutoSuggestResponse {
  errors: any;
  payload: AutoSuggestItem[];
  status: number;
}

export interface NotificationTableDataParams {
  PageSize: number;
  PageNumber: number;
  SearchTerm: string;
  SortBy?: string;
  SortDirection?: boolean;
}