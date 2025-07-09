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

export interface DocumentBasicDetails {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: SingleDocumentDetail[];
}


// props
export interface DocumentManagementServerProps {
  pageNumber: number;
  pageSize: number;
  searchText?: string;
  categoryId?: string[];
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDirection?: string;
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
