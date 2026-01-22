// Represents each row in the document table
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
  documentRealatedTo: number;
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