import React from "react";
import { ShowValAs } from "@essnextgen/ui-kit";

export interface NotificationRowData {
  id: string;
  status: string;
  notification: string;
  priority: string;
  dateReceived: string;
}


export type SetSideIsOpen = (isOpen: any) => void;

export const PriorityType: Record<string, string> = {
  Tier3: "Low",
  Tier2: "Medium",
  Tier1: "High"
}

export interface TableNotificationProps {
  id: string;
  status: boolean;
  title: string;
  priority: keyof typeof PriorityType;
  receivedDate?: string
}

export type NotificationTableRow = {
  id: string;
  Status: string;
  Notification: string;
  Priority: string;
  "Date received": string;
  doc: string;
};

export type NotificationTableData = {
  text: string;
  isShow: boolean;
  showValAs: ShowValAs;
  isTextTruncate?: boolean;
  columnWidth: string;
  isHeaderTextTruncate?: boolean;
  headerTxtTrunctLength?: number;
  isSimpleText?: boolean;
  txtTrunctLength?: number;
  isColumnSorting?: boolean;
  isColumnSortByDefault?: boolean;
  isColumnSortAscFirst?: boolean | undefined;
  anyComponent?: (cellData: any, rowData?: any) => JSX.Element;
}[]

export interface UseNotificationReturnType {
  filterBtnClicked: boolean;
  setFilterBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalNotifications: number;
  handlePageChange: (event: any, page: number) => void;
  searchTerm: string;
  isSearching: boolean;
  noResults: boolean;
  setNoResults: React.Dispatch<React.SetStateAction<boolean>>;
  // handleListCheckboxChange: (index: number, id: string) => void;
  // handleSelectAllChange: (event: any, ids: string[]) => void;
  handleSelectedCheckboxIds: (ids: string[]) => void;
  // handleBulkAction: (item: any, ids: string[]) => void;
  isDeleteDialogOpen: boolean;
  closeDeleteDialog: () => void;
  // confirmDelete: () => Promise<void>;
  isDeleteLoading: boolean;
  showDeleteToast: boolean;
  isClearSelectedCheckbox: boolean;
  selectedCount: number;
  isNoSelectionMode: boolean;
  filters: any; // Replace 'any' with your actual filters type
  handleFilterChange: (filters: any) => void;
  // handleClearAllFilters: () => void;
  // searchTagList: any[]
  // ; // Replace 'any' with your actual tag type
  sortBy: string;
  sortDirection: string;
  // handleSort: (column: string) => void;
}