import React from "react";
import { ShowValAs, SuggestionItem } from "@essnextgen/ui-kit";

export interface NotificationRowData {
  id: string;
  status: string;
  notification: string;
  priority: string;
  dateReceived: string;
}

export declare type Suggestion = {
  name: string;
  values: Array<SuggestionItem>;
};

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
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalNotifications: number;
  handlePageChange: (event: any, page: number) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
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
  filters: any;
  handleFilterChange: (filters: any) => void;
  handleClearAllFilters: () => void;
  // searchTagList: any[]
  sortBy: string;
  sortDirection: boolean;
  handleSort: (column: string) => void;
  // handleSearchChangeWithAutoSuggest: (value: string) => void;
  // handleSearchKeyPressed: (inputValue: string) => void;
  isAutoSuggestVisible: boolean;
  setIsAutoSuggestVisible: React.Dispatch<React.SetStateAction<boolean>>;
  suggestionLoader: boolean;
  setSuggestionLoader: React.Dispatch<React.SetStateAction<boolean>>;
  searchSuggestions: Suggestion[];
  setSearchSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;

}

export interface NotificationTableHeader {
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
}