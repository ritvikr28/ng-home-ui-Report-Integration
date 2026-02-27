import React from "react";

export interface NotificationTableSectionProps {
  tableDataError: boolean;
  tableRows: any[];
  tableHeadersData: any[];
  isTableBodyLoading: boolean;
  sideIsOpen: boolean;
  setSideIsOpen: (open: boolean) => void;
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  notificationIdSelected: string | undefined;
  tableData: any[];
  totalTableData: number;
  hasSearch: boolean;
  hasActiveFilters: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setNoResults: React.Dispatch<React.SetStateAction<boolean>>;
  setTableData: React.Dispatch<React.SetStateAction<any[]>>;
  setTotalTableData: React.Dispatch<React.SetStateAction<number>>;
  setTableDataError: React.Dispatch<React.SetStateAction<any>>;
  setIsTableBodyLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notificationState: { searchCleared: boolean };
  setNotificationState: React.Dispatch<React.SetStateAction<{
    searchCleared: boolean;
  }>>;
  filterBtnClicked: boolean;
  setFilterBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
  filters?: {
    status?: string[] | undefined;
    priority?: string[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status?: string[] | undefined;
    priority?: string[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
  }>>;
}

export interface AutoSuggestItem {
  title: string;
}

export type SearchTag = Array<{
    text: string;
    categoryName: string;
    closeObj: {
        name: string;
        id: number;
        value?: string;
    };
}>;

export interface AutoSuggestReturnResponse {
  errors: any;
  payload: AutoSuggestItem[];
  status: number;
}

export interface NotificationItem {
  id: string;
  priority: string;
  receivedDate: string;
  status: boolean;
  title: string;
  body: string;
}

export interface NotificationResponseTableData {
  error: any;
  payload?: NotificationItem[];
  status: number;
  total?: number;
}

export interface serachKeyPressedObjectType {
  inputValue: string;
  currentPage: number;
  sortBy?: string;
  sortDirection?: boolean;
  setIsTableBodyLoading: (loading: boolean) => void;
  setTableData: (data: NotificationItem[]) => void;
  setTotalTableData: (total: number) => void;
  setTableDataError: (error: boolean) => void;
  setNoResults: (noResults: boolean) => void;
}


export interface NotificationTableHandlerOptions {
  inputValue: string;
  currentPage: number;
  sortBy: string;
  sortDirection: boolean | undefined;
  setIsTableBodyLoading: (v: boolean) => void;
  setTableData: (v: any[]) => void;
  setTotalTableData: (v: number) => void;
  setTableDataError: (v: boolean) => void;
  setNoResults: (v: boolean) => void;
}