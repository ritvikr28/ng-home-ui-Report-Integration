// Represents each row in the document table
import { DialogTemplate, ISelectedItem, NotificationStatus, Suggestion } from "@essnextgen/ui-kit";
import React from "react";

export interface SingleDocumentDetail {
  organizationId: string;
  userId: string;
  registrationId: number;
  fileId: string;
  personExternalId: string;
  documentInfo: {
    fileName: string;
    isSelectedForPrepareDownload: boolean;
  };
  document: string;
  relatedTo: string[] | null;
  category: string;
  addedBy: string;
  dateAdded: string;
  format: string;
  size: string;
  blobName: string;
}
// Represents the entire API response from getdocumentdetails
export interface DocumentBasicDetails {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: SingleDocumentDetail[];
  status: number;
  statusCode: number;
}


// props
export interface DocumentManagementServerProps {
  pageNumber: number;
  pageSize: number;
  categoryId?: number[];
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDirection?: string;
  referenceExternalId?: string[];
  documentRelatedTo?: number;
}

export interface tableDataProps {
  id: string;
  Document: string;
  Relatedto: string[];
  Category: string;
  Addedby: string;
  "Date added": string;
  Format: string;
  Size: string;
}

export interface DocumentSuggestion {
  id: string | number;
  name: string;
  value: string;
  values: string[];
}

export interface Category{
  registrationId: number[];
  application: string;
  section: string[];
};

export interface CategoryData {
  application: string;
  section: string;
  code: string;
  category: string;
  categoryId: number;
};

 export interface ViewDownloadItem {
        name?: string;
        status?: string;
        fileExpiryDays?: number;
        partitionKey?: string;
        fileId: string;
        application: string;
        section: string;
        blobName?: string;
    }

export interface DocumentPrepareDownload {
  fileId: string;
  registrationId: number;
  status?: string;
}

export interface DocumentCategoryResponse {
  error: string;
  payload: CategoryData[];
  status: string;
}

export interface ReferenceMappingDetail {
  refernceExternalId: string;
  documentRelatedTo: string;
  relatedTo: any[];
}

export interface DownloadCriteria {
  refernceMappingDetails: ReferenceMappingDetail[];
  categoryId: number[];
  fromDate: string;
  toDate: string;
}

export interface PrepareDownloadRequest {
  selectAll: boolean;
  downloadCriteria: DownloadCriteria;
  fileDetails: DocumentPrepareDownload[];
}

export interface deleteDocumentRequest {
  selectAll: boolean;
  categoryId: number[];
  fromDate: string;
  toDate: string;
  referenceDetails: referenceDetails;
  fileDetails: deleteDocumentFilesDetails[];

}

export interface referenceDetails {
  referenceExternalIds: string[];
  documentRelatedTo: number;
}

export interface deleteDocumentFilesDetails {
  fileId: string;
  registrationId: number;
  externalId: string;
}

export interface FetchViewDownloadDataParams {
  showLoader?: boolean;
  setIsSidePanelLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setViewData: React.Dispatch<React.SetStateAction<any[]>>;
  viewDownload: () => Promise<any>;
  downloadPollingIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  setIsViewDownloadError: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEmailNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FetchDocumentCategoryDataParams {
  payload: { CategoryRequest: { ReferenceExternalId: string[] } };
  setCategoryError: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCategories: React.Dispatch<React.SetStateAction<any[]>>;
  setLocalSelectedCategories: React.Dispatch<React.SetStateAction<any[]>>;
  localSelectedCategories: any[];
}

export interface ValidationFileDetail {
  fileId: string;
  registrationId: number;
  externalId: string;
}

export interface BuildValidationPayloadParams {
  isSelectAll?: boolean;
  userActivity?: string;
  categoryIds?: number[];
  fromDate?: string;
  toDate?: string;
  referenceExternalIds?: string[];
  documentRelatedTo?: number;
  fileDetails?: ValidationFileDetail[];
  excludedFileDetails?: ValidationFileDetail[];
}

export interface DateRange {
fromDate: string;
toDate: string;
}


export interface DocumentRow {
fileId: string;
document?: string;
category?: string;
addedBy?: string;
dateAdded?: string;
format?: string;
size?: string;
}


export interface DocumentData {
data?: DocumentRow[];
totalCount?: number;
}


export interface SelectedDocument {
fileId: string;
registrationId: number;
externalId: string;
}


export type SidePanelReason = "prepare" | "view";

export interface BreadcrumbAction {
  active: boolean;
  linkName: string;
  path: string;
}

export type FetchGetDocumentDetailsLogicParams = {
  page: number;
  categories: number[];
  sortByCol: string;
  sortOrder: string;
  dateRange: { fromDate?: string; toDate?: string };
  refExternalId: string[];
  relatedTo: number;
  setDocData: (v: any) => void;
  setCurrentPage: (v: number) => void;
  setTotalPage: (v: number) => void;
  setShowSearchError: (v: boolean) => void;
  setIsSearchLoading: (v: boolean) => void;
  setIsSearchDataLoading: (v: boolean) => void;
  setPrepareDownloadAbortBanner: (v: boolean) => void;
  setShowDeleteAbortBanner: (v: boolean) => void;
  setShowDeleteErrorBanner: (v: boolean) => void;
  setSuggestions: (v: Suggestion[]) => void;
};

// Dialog types used across the app
export type DialogType = "clearAll" | "delete" | "prepareDownload";

// Dialog config returned to UI
export interface DialogConfig {
  cancelText: string;
  okText?: string;
  contentText: string;
  isNotificationanner: boolean;
  notificationTitle: string;
  notificationStatus: NotificationStatus;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  template: DialogTemplate;
}

type MaybePromise<T> = T | Promise<T>;
export type ErrorResponse = { status?: number; detail?: string; error?: string };


export interface GetDialogConfigParams {
  dialogType: DialogType | null;
  t: (key: string, options?: Record<string, any>) => string;

  availableFileCount: number;
  alreadyDeletedFileCount: number;
  restrictedFileCount: number;
  totalSelectedCount: number;

  docData?: DocumentData;
  viewData: any;

  isHeaderBoxChecked: boolean;
  selectedFormats: ISelectedItem[];

  currentPage: number;
  sortBy: string;
  sortDirection: string;
  searchRefExternalId?: string[];
  documentRelatedTo?: number;

  selectedCheckBoxIds: string[];
  excludedCheckBoxIds: string[];
  allSelectedDocs: any[];

  dateRange: any;
  selectedEntities: any;
  availableFileIds: string[];

  // setters
  setShowConfirmDialog: (v: boolean) => void;
  setClearAllError: (v: boolean) => void;
  setShowToastNotification: (v: boolean) => void;
  setViewData: (v: any) => void;
  setHasFetchedViewDownload: (v: boolean) => void;
  setIsViewDownloadError: (v: boolean) => void;
  setShowEmailNotification: (v: boolean) => void;

  setSelectedCheckBoxIds: (v: string[]) => void;
  setAllSelectedDocs: (v: any[]) => void;
  setIsClearSelectedCheckbox: (v: boolean) => void;
  setIsHeaderBoxChecked: (v: boolean) => void;
  setPrevSelectedDocs: (v: any[]) => void;
  setExcludedCheckBoxIds: (v: string[]) => void;
  setTableKey: (cb: (v: number) => number) => void;

  setIsDialogLoading: (v: boolean) => void;
  setIsGlobalLoaderModel: (v: boolean) => void;
  setPrepareDownloadError: (v: boolean) => void;
  setPrepareDownloadAbortBanner: (v: boolean) => void;
  setIsSidePanelLoader: (v: boolean) => void;
  setIsSidePanelOpen: (v: boolean) => void;
  setSidePanelOpenReason: (v: "prepare") => void;

  handleClearAllConfirm: (args: any) => Promise<void>;
  handleBulkDelete: () => MaybePromise<void>;
  buildSelectedDocs: (...args: any[]) => any[];
  prepareDownload: (docs: any[]) => Promise<number[]>;

  fetchViewDownloadData: () => void;
  clearAllFiles: (payload: {
   request: { partitionKey: string[] };
 }) => Promise<number | string[] | ErrorResponse>;

  viewDownload: any;
  downloadPollingIntervalRef: React.MutableRefObject<any>;

  fetchGetDocumentDetails: (
    page: number,
    registrationIds: any[],
    sortBy: string,
    sortDirection: string,
    refExternalId: string[],
    searchRefExternalId?: string,
    documentRelatedTo?: string
  ) => void;

  gtmAnalytics: {
    pushEvent: (event: Record<string, any>) => void;
  };

  allRegistrationIds: any[];
  getCompletedPartitionKeys: (viewData: {
    status?: string | undefined;
    partitionKey?: string | undefined;
  }[]) => string[];
  contentText: JSX.Element;
  getAllRegistrationIds: (selectedFormats: any[]) => any[];
  referenceExternalId: string[];
}
